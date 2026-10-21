import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const FIRESTORE_PROJECT_ID = 'commanding-bond-v5xj8';
const FIRESTORE_DATABASE_ID = 'ai-studio-e02f872d-9aaa-41a2-8b00-28bd5eb4d807';
const FIRESTORE_API_KEY = 'AIzaSyDf-sottrGY7avrz9vSanPerxo1SR0CB3A';

function parseFirestoreFields(fields: any) {
  if (!fields) return {};
  const res: any = {};
  for (const [key, val] of Object.entries<any>(fields)) {
    if (val.stringValue !== undefined) res[key] = val.stringValue;
    else if (val.booleanValue !== undefined) res[key] = val.booleanValue;
    else if (val.integerValue !== undefined) res[key] = Number(val.integerValue);
    else if (val.doubleValue !== undefined) res[key] = Number(val.doubleValue);
    else if (val.arrayValue !== undefined) {
      res[key] = (val.arrayValue.values || []).map((v: any) => v.stringValue || v);
    }
  }
  return res;
}

async function fetchArtistData(identifier: string) {
  if (!identifier) return null;
  const cleanId = identifier.trim().replace(/^@/, '');
  const possibleTags = [`@${cleanId}`, cleanId, cleanId.toLowerCase(), `@${cleanId.toLowerCase()}`];

  // 1. Try querying by userTag
  try {
    for (const tag of possibleTags) {
      const runQueryUrl = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents:runQuery?key=${FIRESTORE_API_KEY}`;
      const queryBody = {
        structuredQuery: {
          from: [{ collectionId: 'users' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'userTag' },
              op: 'EQUAL',
              value: { stringValue: tag }
            }
          },
          limit: 1
        }
      };

      const res = await fetch(runQueryUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryBody)
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data[0] && data[0].document) {
          const doc = data[0].document;
          const uid = doc.name.split('/').pop();
          return { uid, ...parseFirestoreFields(doc.fields) };
        }
      }
    }
  } catch (e) {
    console.error('Error in og artist query:', e);
  }

  // 2. Try fetching directly by document UID
  try {
    const docUrl = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents/users/${identifier}?key=${FIRESTORE_API_KEY}`;
    const res = await fetch(docUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.fields) {
        return { uid: identifier, ...parseFirestoreFields(data.fields) };
      }
    }
  } catch (e) {
    console.error('Error fetching artist by UID in og:', e);
  }

  return null;
}

async function fetchPhotoData(photoId: string) {
  if (!photoId) return null;
  try {
    const docUrl = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT_ID}/databases/${FIRESTORE_DATABASE_ID}/documents/photos/${photoId}?key=${FIRESTORE_API_KEY}`;
    const res = await fetch(docUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.fields) {
        return parseFirestoreFields(data.fields);
      }
    }
  } catch (e) {
    console.error('Error fetching photo by ID in og:', e);
  }
  return null;
}

export default async function handler(request: Request) {
  let fallbackImage = 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1000&q=80';
  try {
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag') || url.searchParams.get('id') || '';
    const obraId = url.searchParams.get('obra') || '';

    const artist = await fetchArtistData(tag);
    const photo = obraId ? await fetchPhotoData(obraId) : null;

    // Pick best high impact image: specific tattoo photo > profilePhoto > background photo > default fallback
    let heroImage = fallbackImage;
    if (photo && (photo.url || photo.src || photo.highResUrl)) {
      heroImage = photo.url || photo.src || photo.highResUrl;
    } else if (artist?.profilePhotoUrl && artist.profilePhotoUrl.startsWith('http')) {
      heroImage = artist.profilePhotoUrl;
    } else if (Array.isArray(artist?.backgroundPhotos) && artist.backgroundPhotos.length > 0 && artist.backgroundPhotos[0].startsWith('http')) {
      heroImage = artist.backgroundPhotos[0];
    }
    fallbackImage = heroImage;

    const displayName = artist?.displayName || tag.replace(/^@/, '') || 'Artista Profesional';
    const userTag = artist?.userTag ? (artist.userTag.startsWith('@') ? artist.userTag : `@${artist.userTag}`) : (tag ? `@${tag.replace(/^@/, '')}` : '@turnostattoo');
    
    // Specialties
    let specialties = 'Blackwork • Fine Line • Realismo';
    if (Array.isArray(artist?.specialtyTags) && artist.specialtyTags.length > 0) {
      specialties = artist.specialtyTags.filter(Boolean).slice(0, 3).join(' • ');
    }

    const isAvailable = artist?.isAvailable !== false;
    const studioCity = artist?.studioAddress || 'Estudio Privado';

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            width: '1200px',
            height: '630px',
            backgroundColor: '#070809',
            position: 'relative',
            overflow: 'hidden',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Subtle background glow */}
          <div
            style={{
              position: 'absolute',
              top: '-150px',
              right: '-150px',
              width: '600px',
              height: '600px',
              borderRadius: '300px',
              background: 'radial-gradient(circle, rgba(5, 77, 68, 0.45) 0%, rgba(5, 77, 68, 0) 70%)',
            }}
          />

          {/* LEFT COLUMN: High Impact Visual (500px width) */}
          <div
            style={{
              display: 'flex',
              width: '490px',
              height: '630px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              src={heroImage}
              alt={displayName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Smooth dark gradient fading to the right panel */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to right, rgba(7, 8, 9, 0) 50%, #070809 100%)',
              }}
            />
            {/* Top/bottom subtle vignettes */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to bottom, rgba(7, 8, 9, 0.35) 0%, transparent 20%, transparent 80%, rgba(7, 8, 9, 0.6) 100%)',
              }}
            />
          </div>

          {/* RIGHT COLUMN: Conversion & Authority Data (710px width) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '710px',
              height: '630px',
              padding: '60px 65px 50px 30px',
              zIndex: 10,
            }}
          >
            {/* TOP HEADER: Branding & Studio Location */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#054d44',
                    border: '1px solid #2dd4bf',
                  }}
                >
                  <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '15px' }}>TT</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#ffffff', fontWeight: 900, fontSize: '18px', letterSpacing: '2px' }}>
                    TURNOS <span style={{ color: '#2dd4bf' }}>TATTOO</span>
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    Plataforma Oficial
                  </span>
                </div>
              </div>

              {/* Location pill */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 600 }}>📍 {studioCity}</span>
              </div>
            </div>

            {/* CENTER CONTENT: Artist Name, Tag, Specialties & Urgency Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
              {/* Dynamic Urgency Badge (CRO) */}
              <div style={{ display: 'flex', marginBottom: '18px' }}>
                {isAvailable ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(5, 77, 68, 0.4)',
                      border: '1.5px solid #10b981',
                      padding: '8px 18px',
                      borderRadius: '30px',
                      boxShadow: '0 0 20px rgba(5, 77, 68, 0.5)',
                    }}
                  >
                    <div
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        boxShadow: '0 0 8px #10b981',
                      }}
                    />
                    <span
                      style={{
                        color: '#a7f3d0',
                        fontSize: '12px',
                        fontWeight: 900,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      AGENDA ABIERTA • RESERVAS ONLINE
                    </span>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'rgba(35, 35, 35, 0.65)',
                      border: '1.5px solid rgba(255, 255, 255, 0.2)',
                      padding: '8px 18px',
                      borderRadius: '30px',
                    }}
                  >
                    <div
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: '#fbbf24',
                      }}
                    />
                    <span
                      style={{
                        color: '#e5e7eb',
                        fontSize: '12px',
                        fontWeight: 800,
                        letterSpacing: '1.5px',
                        textTransform: 'uppercase',
                      }}
                    >
                      TURNOS LLENOS • LISTA DE ESPERA
                    </span>
                  </div>
                )}
              </div>

              {/* Artist Display Name */}
              <h1
                style={{
                  fontSize: displayName.length > 18 ? '44px' : '54px',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.05,
                  margin: '0 0 8px 0',
                  letterSpacing: '-1px',
                  textTransform: 'uppercase',
                }}
              >
                {displayName}
              </h1>

              {/* Artist Tag */}
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#2dd4bf',
                  letterSpacing: '0.5px',
                  marginBottom: '16px',
                }}
              >
                {userTag}
              </span>

              {/* Specialties / Styles */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  width: 'fit-content',
                }}
              >
                <span style={{ color: '#e5e7eb', fontSize: '14px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                  {specialties}
                </span>
              </div>
            </div>

            {/* BOTTOM CALL TO ACTION: High CTR bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                width: '100%',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#9ca3af', fontSize: '13px', fontWeight: 500 }}>
                  Toca el link para ver galería completa y agendar
                </span>
                <span style={{ color: '#2dd4bf', fontSize: '16px', fontWeight: 900 }}>➔</span>
              </div>

              <span style={{ color: '#4b5563', fontSize: '12px', fontWeight: 600, letterSpacing: '1px' }}>
                turnostattoo.com
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, immutable, no-transform, max-age=3600, s-maxage=86400',
        },
      }
    );
  } catch (error: any) {
    console.error('Error generating OG image:', error);
    // Graceful fallback redirect to hero image or brand fallback
    return Response.redirect(fallbackImage, 302);
  }
}
