import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, where, doc, getDoc } from 'firebase/firestore';

export default function Preload() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artistName, setArtistName] = useState(() => {
    try {
      const saved = localStorage.getItem('demoArtistData_' + (id || 'demo'));
      if (saved) {
        const data = JSON.parse(saved);
        if (data.displayName) return data.displayName;
      }
    } catch(e) {}
    return 'Victor Ink';
  });
  const [specialties, setSpecialties] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('demoArtistData_' + (id || 'demo'));
      if (saved) {
        const data = JSON.parse(saved);
        if (data.specialtyTags && data.specialtyTags.length > 0) return data.specialtyTags;
      }
    } catch(e) {}
    return ['Realismo', 'Black & Grey'];
  });
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(() => {
    try {
      const saved = localStorage.getItem('demoArtistData_' + (id || 'demo'));
      if (saved) {
        const data = JSON.parse(saved);
        if (data.profilePhotoUrl) return data.profilePhotoUrl;
      }
    } catch(e) {}
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0';
  });
  const [isFetchingBg, setIsFetchingBg] = useState(true);
  const [bgPhotos, setBgPhotos] = useState<string[]>(() => {
    try {
      const savedBg = localStorage.getItem('demoBgPhotos_' + (id || 'demo'));
      if (savedBg) {
        const parsed = JSON.parse(savedBg);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return [];
  });

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('demoArtistData_' + (id || 'demo'));
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.displayName) setArtistName(data.displayName);
          if (data.specialtyTags && data.specialtyTags.length > 0) setSpecialties(data.specialtyTags);
          if (data.profilePhotoUrl) setProfilePhotoUrl(data.profilePhotoUrl);
        } catch(e) {}
      }

    };
    
    loadData();
    window.addEventListener('profileDataChanged', loadData);
    return () => window.removeEventListener('profileDataChanged', loadData);
  }, []);

  
  useEffect(() => {
    let isMounted = true;
    let minTimePassed = false;
    let dataLoaded = false;

    const navigateToProfile = () => {
      if (isMounted && minTimePassed && dataLoaded) {
        sessionStorage.setItem('preloaded_' + (id || 'demo'), 'true');
        navigate(id ? '/artist/' + id : '/demo/profile', { replace: true });
      }
    };

    const timer = setTimeout(() => {
      minTimePassed = true;
      navigateToProfile();
    }, 2000);

    const preloadImages = async () => {
      try {
        let artistUid = id;
        if (!artistUid && auth.currentUser) {
            artistUid = auth.currentUser.uid;
        } else if (!artistUid) {
            artistUid = 'anonymous_demo';
        }

        // Fetch artist profile data for preload display
        if (artistUid !== 'anonymous_demo') {
           const userDoc = await getDoc(doc(db, 'users', artistUid));
           if (userDoc.exists()) {
               const data = userDoc.data();
               if (data.displayName) setArtistName(data.displayName);
               if (data.specialtyTags && data.specialtyTags.length > 0) setSpecialties(data.specialtyTags);
               if (data.profilePhotoUrl) setProfilePhotoUrl(data.profilePhotoUrl);
               localStorage.setItem('demoArtistData_' + (id || 'demo'), JSON.stringify(data));
           }
        }

        const q = query(
            collection(db, 'photos'),
            where('createdBy', '==', artistUid),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const mappedPhotos = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                src: data.url,
                thumbnailUrl: data.thumbnailUrl,
                alt: data.info || data.title,
                title: data.title,
                categories: data.tags || [],
                filters: data.filters,
                hours: data.hours,
                sessions: data.sessions,
                size: data.size,
                pinnedOrder: data.pinnedOrder,
                pinned: data.pinned,
                originalFallbackId: data.originalFallbackId
            };
        });
        localStorage.setItem('demoAllTattoos_' + (id || 'demo'), JSON.stringify(mappedPhotos));
        
        mappedPhotos.sort((a, b) => {
           const aPinned = a.pinned === true;
           const bPinned = b.pinned === true;
           if (aPinned && bPinned) return (a.pinnedOrder || 0) - (b.pinnedOrder || 0);
           if (aPinned) return -1;
           if (bPinned) return 1;
           return 0;
        });
        const urlsToPreload = mappedPhotos.map(data => data.thumbnailUrl || data.src).filter(url => url);
        
        // Grab top 3 pinned/recent for background
        let top3 = mappedPhotos.slice(0, 3).map(data => data.thumbnailUrl || data.src).filter(url => url);
        if (top3.length > 0) {
            // Need exactly 4 items for the CSS 25% width logic to work correctly
            let bg4 = [...top3];
            while(bg4.length < 4) {
                bg4.push(bg4[bg4.length % top3.length]);
            }
            // Only update state if URLs are different to avoid re-rendering jump
            setBgPhotos(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(bg4)) {
                return bg4;
              }
              return prev;
            });
            localStorage.setItem('demoBgPhotos_' + (id || 'demo'), JSON.stringify(bg4));
        }

        // Wait for images to load in browser cache
        await Promise.all(urlsToPreload.map(url => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve; // resolve anyway so we don't block
          });
        }));
      } catch (err) {
        console.error('Error preloading images:', err);
      } finally {
        dataLoaded = true;
        navigateToProfile();
      }
    };

    preloadImages();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigate, id]);


  return (
    <div className="bg-background text-white font-body m-0 p-0 overflow-hidden fixed inset-0 touch-none h-[100dvh] w-full z-50">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="animate-scroll-bg h-full">
          {bgPhotos.length > 0 ? (
            <>
              {bgPhotos.map((url, i) => (
                <img key={i} alt={`Background Tattoo ${i+1}`} className="carousel-img" src={url} />
              ))}
              {/* Duplicate for infinite loop */}
              {bgPhotos.map((url, i) => (
                <img key={`dup-${i}`} alt={`Background Tattoo ${i+1}`} className="carousel-img" src={url} />
              ))}
            </>
          ) : isFetchingBg ? null : (
            <>
              <img alt="Tattoo 1" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" />
              <img alt="Tattoo 2" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHwNb_MhbHOaP6c0Rl1EqFCiTHvx3OrwkHec41w-pIzdVOr7fsJR6seTV1H8FzBJ3iiQ-niPppsHlussWManmq3_37uMTyIRgGyAfz38023h98-mc7TXCSIobUFesaE9i91952TUovITXSuF_0DHR_r_6GS38wv-AYSWni62vZFkiIacuuAHSHqUBld76UFh-NsXjsIcZg-h_Vn10CGZcp3HYUtlUEeh82negXGsgP2u_nBmavAlj48S7v5uf-_qARYs4xf7o9gE8" />
              <img alt="Tattoo 3" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBExqvT9llX2D0HY5gXD0pgutK1YUyCLP8CEJNM8DIVtN8ENfn13RmMA5bovsMB-J8PbQROw4rmvLORq0cF06c0VBS-zmh5vwUl_NjO2286Jnxr4srgoffNsb3K-JLYcCnNu81k1Cr-NYP_zhnNCtodbCXfKdcnq642dwIfs68cY47x8J7t7YsfjcAGo0eHcF5dfZEsWIDrYHtHIcbUkCn02Aho6E_OGQH6HdhW0i8n5qmt9rh0jY2uJWH3_qIzu7GXxNkfS-jybkg" />
              <img alt="Tattoo 4" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASHOMWeKVAQxGeWzc3sI2E5n8qAgw4P6xBLVnmV7EZhijxL5vffctyZq054C_Kcef9vYXNrqjJGHNeLW-lkEWK9KyQkyhnDLgXzLHPBh6ptgR6rrfFHCLKGzn4OJ7orZ8TZRua_YRLRwa5zhHRlFw8fZZurBfewtZA7Y2irrPpphi6K9XRUng_BiIaoMKAeAhG1-E8Re72e3sJpdd-7sZHmafVRKt2n5usQT048dwPRTpveoXDEmTg8JVskpX5GowUCm2MaHCDMnw" />
              {/* Duplicate for infinite loop */}
              <img alt="Tattoo 1" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" />
              <img alt="Tattoo 2" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHwNb_MhbHOaP6c0Rl1EqFCiTHvx3OrwkHec41w-pIzdVOr7fsJR6seTV1H8FzBJ3iiQ-niPppsHlussWManmq3_37uMTyIRgGyAfz38023h98-mc7TXCSIobUFesaE9i91952TUovITXSuF_0DHR_r_6GS38wv-AYSWni62vZFkiIacuuAHSHqUBld76UFh-NsXjsIcZg-h_Vn10CGZcp3HYUtlUEeh82negXGsgP2u_nBmavAlj48S7v5uf-_qARYs4xf7o9gE8" />
              <img alt="Tattoo 3" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBExqvT9llX2D0HY5gXD0pgutK1YUyCLP8CEJNM8DIVtN8ENfn13RmMA5bovsMB-J8PbQROw4rmvLORq0cF06c0VBS-zmh5vwUl_NjO2286Jnxr4srgoffNsb3K-JLYcCnNu81k1Cr-NYP_zhnNCtodbCXfKdcnq642dwIfs68cY47x8J7t7YsfjcAGo0eHcF5dfZEsWIDrYHtHIcbUkCn02Aho6E_OGQH6HdhW0i8n5qmt9rh0jY2uJWH3_qIzu7GXxNkfS-jybkg" />
              <img alt="Tattoo 4" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASHOMWeKVAQxGeWzc3sI2E5n8qAgw4P6xBLVnmV7EZhijxL5vffctyZq054C_Kcef9vYXNrqjJGHNeLW-lkEWK9KyQkyhnDLgXzLHPBh6ptgR6rrfFHCLKGzn4OJ7orZ8TZRua_YRLRwa5zhHRlFw8fZZurBfewtZA7Y2irrPpphi6K9XRUng_BiIaoMKAeAhG1-E8Re72e3sJpdd-7sZHmafVRKt2n5usQT048dwPRTpveoXDEmTg8JVskpX5GowUCm2MaHCDMnw" />
            </>
          )}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 z-0"></div>

      {/* Central Content */}
      <main className="relative z-10 w-full h-full flex flex-col items-center justify-between py-6 md:py-16 px-6 overflow-hidden">
        {/* Logo */}
        <div className="flex-shrink-0 mt-6">
          <h1 className="font-display-lg text-xl md:text-4xl font-bold tracking-widest uppercase text-white text-center">Turnos <span className="text-primary font-light">Tattoo</span></h1>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center w-full">
          {/* Profile & Loader */}
          <div className="relative flex flex-col items-center">
            <div className="relative md:w-48 md:h-48 flex items-center justify-center w-28 h-28 mb-4">
              {/* Circular Loading SVG */}
              <svg className="absolute inset-0 w-full h-full text-primary" fill="none" stroke="currentColor" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" stroke="#054d44" strokeDasharray="301.6" strokeDashoffset="301.6" strokeLinecap="round" strokeWidth="2" style={{ animation: 'draw-progress 2s cubic-bezier(0.8, 0, 0.2, 1) forwards', transformOrigin: '50% 50%' }}></circle>
              </svg>
              
              {/* Profile Image */}
              <div className="md:w-44 md:h-44 rounded-full overflow-hidden border border-white/10 p-1 bg-black shadow-2xl w-24 h-24 relative z-10">
                <img alt={artistName} className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700" src={profilePhotoUrl} />
              </div>
            </div>

            {/* Artist Name */}
            <div className="text-center">
              <h2 className="font-display-lg text-2xl md:text-5xl font-light tracking-widest text-white uppercase">{artistName}</h2>
            </div>
          </div>

          {/* Specialty Tags relocated close to name */}
          {(() => {
            const count = specialties.length;
            let containerClass = "flex justify-center mt-4 md:mt-12 w-full max-w-lg px-2 md:px-4 ";
            if (count === 1) containerClass += "gap-2";
            else if (count === 2) containerClass += "gap-6 md:gap-8";
            else containerClass += "gap-2 justify-between md:justify-center md:gap-4";
            
            return (
              <div className={containerClass}>
                {specialties.map((tag, index) => (
                  <span key={index} className="text-[10px] md:text-sm tracking-[0.2em] text-white border border-primary px-2 py-1 md:px-4 md:py-2 rounded-full uppercase transition-all flex items-center justify-center whitespace-nowrap truncate max-w-[32%] md:max-w-none flex-1 md:flex-none">
                    {tag}
                  </span>
                ))}
              </div>
            );
          })()}
        </div>

        <div className="flex-shrink-0 mb-4 md:mb-12">
          <p className="font-body-lg text-lg md:text-2xl text-primary tracking-[0.2em] uppercase opacity-90 font-bold animate-pulse text-center">
            Cargando Portfolio
            <span className="inline-flex ml-1">
              <span className="animate-bounce [animation-delay:-0.3s]">.</span>
              <span className="animate-bounce [animation-delay:-0.15s]">.</span>
              <span className="animate-bounce">.</span>
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
