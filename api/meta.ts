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
    console.error('Error querying artist by tag:', e);
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
    console.error('Error fetching artist by UID:', e);
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
    console.error('Error fetching photo by ID:', e);
  }
  return null;
}

export default async function handler(req: any, res?: any) {
  const isNode = Boolean(res && typeof res.status === 'function');
  
  let host = 'turnos-tattoo-ink.vercel.app';
  let rawPath = '';
  let obraId = '';
  let protocol = 'https';

  if (isNode) {
    host = req.headers?.['x-forwarded-host'] || req.headers?.['host'] || host;
    protocol = req.headers?.['x-forwarded-proto'] || (host.includes('localhost') ? 'http' : 'https');
    rawPath = req.query?.path || '';
    obraId = req.query?.obra || '';
    if (!rawPath && req.url) {
      try {
        const parsed = new URL(req.url, `${protocol}://${host}`);
        rawPath = parsed.searchParams.get('path') || parsed.pathname;
        obraId = obraId || parsed.searchParams.get('obra') || '';
      } catch (e) {}
    }
  } else {
    // Web standard Request (Edge runtime)
    try {
      const url = new URL(req.url);
      host = req.headers?.get?.('x-forwarded-host') || req.headers?.get?.('host') || url.host || host;
      protocol = req.headers?.get?.('x-forwarded-proto') || url.protocol.replace(':', '') || 'https';
      rawPath = url.searchParams.get('path') || url.pathname;
      obraId = url.searchParams.get('obra') || '';
    } catch (e) {
      rawPath = String(req.url || '');
    }
  }

  const baseUrl = `${protocol}://${host}`;
  
  // Clean up path to get the artist tag or id
  let clean = (rawPath || '').replace(/^\//, '').split('?')[0];
  const segments = clean.split('/').filter(Boolean);
  let target = segments[0] || '';
  if (target === 'artist' || target === 'profile' || target === 'u' || target === 'api') {
    target = segments[1] || target;
  }

  const artist = await fetchArtistData(target);
  const photo = obraId ? await fetchPhotoData(obraId) : null;

  const siteName = 'Turnos Tattoo';
  const displayName = artist?.displayName || target.replace(/^@/, '') || 'Artista';
  const tagFormatted = artist?.userTag 
    ? (artist.userTag.startsWith('@') ? artist.userTag : `@${artist.userTag}`) 
    : (target ? `@${target.replace(/^@/, '')}` : '@turnostattoo');
  
  // Specialties
  let specialties = '';
  if (Array.isArray(artist?.specialtyTags) && artist.specialtyTags.length > 0) {
    specialties = artist.specialtyTags.filter(Boolean).join(' • ');
  }

  // Urgency status (CRO)
  const isAvailable = artist?.isAvailable !== false;
  const statusBadge = isAvailable ? '🟢 Agenda Abierta' : '⚪ Turnos Llenos / Lista de Espera';

  // Title & description optimized for CRO
  let ogTitle = `${displayName} (${tagFormatted}) | ${siteName}`;
  if (photo?.name) {
    ogTitle = `«${photo.name}» por ${displayName} | ${siteName}`;
  }

  let ogDescription = `${statusBadge} • ${specialties ? `${specialties}. ` : ''}Conoce el portafolio exclusivo y agenda tu turno online de forma directa.`;
  if (artist?.bio) {
    const cleanBio = artist.bio.replace(/\s+/g, ' ').trim();
    ogDescription = `${statusBadge} • ${cleanBio.slice(0, 140)}... Reserva tu turno online.`;
  }

  // Canonical URL
  const canonicalUrl = `${baseUrl}/${tagFormatted}${obraId ? `?obra=${obraId}` : ''}`;

  // High-resolution image direct from ImgBB / Cloud Storage
  let ogImageUrl = 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=80';
  if (photo && (photo.url || photo.src || photo.highResUrl)) {
    ogImageUrl = photo.url || photo.src || photo.highResUrl;
  } else if (artist?.profilePhotoUrl && artist.profilePhotoUrl.startsWith('http')) {
    ogImageUrl = artist.profilePhotoUrl;
  } else if (Array.isArray(artist?.backgroundPhotos) && artist.backgroundPhotos.length > 0 && artist.backgroundPhotos[0].startsWith('http')) {
    ogImageUrl = artist.backgroundPhotos[0];
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ogTitle}</title>
  
  <!-- Primary Meta Tags -->
  <meta name="title" content="${ogTitle}">
  <meta name="description" content="${ogDescription}">

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="${siteName}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDescription}">
  <meta property="og:image" content="${ogImageUrl}">
  <meta property="og:image:secure_url" content="${ogImageUrl}">
  <meta property="og:image:type" content="image/jpeg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Perfil de ${displayName} en Turnos Tattoo">

  <!-- Twitter / X Cards -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDescription}">
  <meta name="twitter:image" content="${ogImageUrl}">

  <!-- WhatsApp Specific -->
  <meta property="al:web:url" content="${canonicalUrl}">

  <!-- Redirect for human visitors who might open this direct endpoint in browser -->
  <script>
    if (!navigator.userAgent.match(/bot|facebookexternalhit|facebot|whatsapp|twitterbot|telegrambot|linkedinbot|discordbot|slackbot|opengraph|crawler|spider/i)) {
      window.location.replace("${canonicalUrl}");
    }
  </script>
</head>
<body style="background:#070809;color:#fff;font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
  <div style="text-align:center;padding:20px;max-width:500px;">
    <div style="width:70px;height:70px;margin:0 auto 16px;border-radius:50%;overflow:hidden;border:2px solid #2dd4bf;">
      <img src="${ogImageUrl}" alt="${displayName}" style="width:100%;height:100%;object-fit:cover;" />
    </div>
    <h1 style="color:#ffffff;font-size:24px;margin:0 0 6px 0;font-weight:800;">${displayName}</h1>
    <p style="color:#2dd4bf;font-size:15px;font-weight:600;margin:0 0 10px 0;">${tagFormatted}</p>
    <p style="color:#a7f3d0;font-size:12px;font-weight:700;margin:0 0 16px 0;letter-spacing:1px;text-transform:uppercase;">${statusBadge}</p>
    <p style="color:#9ca3af;font-size:13px;line-height:1.5;margin:0 0 20px 0;">${specialties}</p>
    <a href="${canonicalUrl}" style="display:inline-block;background:#054d44;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;border:1px solid #2dd4bf;">Ver Perfil y Agendar</a>
  </div>
</body>
</html>`;

  if (isNode) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(html);
  } else {
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }
}
