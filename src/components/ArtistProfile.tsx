import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { OptimizedImage } from './OptimizedImage';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit, startAfter } from 'firebase/firestore';
import { db, auth, onAuthStateChanged } from '../firebase';
import { globalPreloadCache } from '../lib/cache';


const defaultFaqs = [
  { question: '¿Qué tengo que hacer antes del tatuaje?', answer: 'Venir bien descansado, haber comido bien antes de la sesión y no consumir alcohol ni drogas 24 horas antes. Mantener la piel hidratada los días previos ayuda mucho.' },
  { question: '¿Qué hacer después?', answer: 'Lavar la zona con jabón neutro 2-3 veces al día, aplicar una capa muy fina de crema cicatrizante, no rascar, no exponer al sol directo y evitar piletas/mar por 15 días.' },
  { question: 'Recomendación del tatuador', answer: 'Confía en el proceso y en el diseño. Las mejores piezas surgen cuando hay libertad creativa para adaptar la idea a la anatomía de tu cuerpo.' },
  { question: '¿Duele tatuarse?', answer: 'El dolor es subjetivo y depende de la zona del cuerpo y la tolerancia de cada persona. Generalmente se siente como un rasguño constante, pero es totalmente soportable.' }
];


const DEMO_FALLBACK_PHOTOS = [
    {
      id: "fallback_1",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
      alt: "A highly detailed black and grey realism tattoo of a lion's face on a human forearm.",
      title: "Detailed black & grey realism",
      categories: ["Realismo", "Blackwork"],
      hours: 12,
      sessions: 2,
      size: "20x15 cm"
    },
    {
      id: "fallback_2",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
      alt: "Close-up of a delicate minimalist tattoo of a single rose.",
      title: "Delicate minimalist single rose",
      categories: ["Minimalista"],
      hours: 3,
      sessions: 1,
      size: "8x5 cm"
    },
    {
      id: "fallback_3",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
      alt: "Large-scale blackwork tattoo covering a full back.",
      title: "Large-scale blackwork back piece",
      categories: ["Blackwork", "Tradicional"],
      hours: 24,
      sessions: 4,
      size: "Espalda completa"
    },
    {
      id: "fallback_4",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYd_bLleuw4yQOy32XLTc-ZA36ZI1Tx20UNajjWgcV5DQKPXzxE6vuXBvD3Ov7hcyCDB0Wpbc1BK7v4CJMIFC3KWS1bBdxzGJUcjSraTSohPMSOjESD5If5O8I8ZxmV0rWCZ_T_ncpPVYMBz9OD9_NXcCjwNkftJNjmowLcbK_jq3Fy-FieRJHky4A0G8SWmDSNGfDrlvoUxmb8aYt9Dxvi2w5uLOR4ir0BxgO2Sh5IfSstId4FI96uowW3Y1Jw1YCCRUk82ep4yPk",
      alt: "Hyper-realistic black and grey realism tattoo",
      title: "Hyper-realistic black & grey",
      categories: ["Realismo", "Blackwork"],
      hours: 15,
      sessions: 3,
      size: "Media manga"
    },
    {
      id: "fallback_5",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5LMtrwwTSFu95uiU0bVfXq9VmWZIJ10dyJ3Lwbu6VmGCGEnBfZXi0WQlrXz0JAAAXzBurYTXa8IleL_Z1UTW7x4BHigWcVZCarsYy-PDu3G5JOwCsz3c0mgBTVI90e2b4bcw5lLDYzc5mU0qXptlWkjo0e3ynOS0xxfhCjxtvA0Bykbfo3wSX79T_fwcMg4uFHYXGxws2NYoOaKhhgr6J8ErFHQqB5QJSnK9c2zkwmEgiIM-74wbPKlVjQPO8pxETkDa8jrj1OmA",
      alt: "Detailed blackwork owl",
      title: "Detailed blackwork owl",
      categories: ["Blackwork", "Realismo"],
      hours: 8,
      sessions: 2,
      size: "15x15 cm"
    }
];

const DEMO_FALLBACK_ARTIST_DATA = {
    displayName: "Victor Ink",
    bio: "Conoce a este increíble artista del tatuaje y explora su portafolio en Turnos Tattoo.",
    backgroundPhotos: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBiWtwSf0Fh3AWm01LAlMfj3JGoOdHldaVkVIRDRpbavMRKQEt_SI7cvqZB7R56dQt7nuInHJM7V0a74racFxJT0E12v57KMBnC09rQOtg5YVpvOdglwy8KnhHl1H0tFedvuBum6LD2ADyKGFqdnQ3lUJqIhOZj6bJPzlLI4S7L2n9tqn9wZ6t8smG60s2wvnHM3NabsjD_rMrUmix943Tdd_CAZDTFaQeq5FEq8IXpsVkSLkJ24K0VpV9R4GRF2SDH8cwWPwwNjXI"],
    profilePhotoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0",
    userTag: "@victor_ink",
    uid: "demo"
};

export default function Profile() {

  const navigate = useNavigate();
  const { id } = useParams();
  
  const resolveTargetId = () => {
        let targetId = id || localStorage.getItem('demoUserId') || 'demo';
        if (id && id.startsWith('@')) {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('demoArtistData_')) {
                    try {
                        const cached = JSON.parse(localStorage.getItem(key) || '{}');
                        if (cached.userTag === id || cached.userTag === '@' + id || '@' + cached.userTag === id) {
                            targetId = cached.uid || key.replace('demoArtistData_', '');
                            break;
                        }
                    } catch(e) {}
                }
            }
        }
        return targetId;
  };
  const [searchParams, setSearchParams] = useSearchParams();
  

  

  const [isTattoosLoading, setIsTattoosLoading] = useState(() => {
        try {
            const targetId = resolveTargetId();
            if (globalPreloadCache[targetId]?.allTattoos) return false;
            if (localStorage.getItem('demoAllTattoos_' + targetId)) return false;
            if (targetId === '@victor_ink' || targetId === 'victor_ink' || targetId === 'demo' || targetId === '@demo' || targetId === 'anonymous_demo') return false;
        } catch(e) {}
        return true;
    });
  const [isProfileLoading, setIsProfileLoading] = useState(() => {
        try {
            const targetId = resolveTargetId();
            if (globalPreloadCache[targetId]?.artistData) return false;
            if (localStorage.getItem('demoArtistData_' + targetId)) return false;
            if (targetId === '@victor_ink' || targetId === 'victor_ink' || targetId === 'demo' || targetId === '@demo' || targetId === 'anonymous_demo') return false;
        } catch(e) {}
        return true;
    });
  const isTargetDemo = () => {
        const targetId = resolveTargetId();
        return targetId === '@victor_ink' || targetId === 'victor_ink' || targetId === 'demo' || targetId === '@demo' || targetId === 'anonymous_demo';
    };
  const [artistData, setArtistData] = useState<any>(() => {
    try {
        const targetId = resolveTargetId();
        let savedData = globalPreloadCache[targetId]?.artistData;
        if (!savedData) {
            const saved = localStorage.getItem('demoArtistData_' + targetId);
            if (saved) savedData = JSON.parse(saved);
        }
        if (savedData) {
            globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], artistData: savedData };
            return savedData;
        }
    } catch(e) {}
    return isTargetDemo() ? DEMO_FALLBACK_ARTIST_DATA : null;
  });


  const [allTattoos, setAllTattoos] = useState<any[]>(() => {
      try {
          const targetId = resolveTargetId();
          let savedData = globalPreloadCache[targetId]?.allTattoos;
          if (!savedData) {
              const saved = localStorage.getItem('demoAllTattoos_' + targetId);
              if (saved) savedData = JSON.parse(saved);
          }
          if (savedData) {
              globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], allTattoos: savedData };
              return savedData;
          }
      } catch(e) {}
      return isTargetDemo() ? DEMO_FALLBACK_PHOTOS : [];
  });
  const [activeCategory, setActiveCategory] = useState("All");
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTattooIndex, setActiveTattooIndex] = useState(0);
  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState({ name: '', phone: '', email: '', style: '', size: '', placement: '', details: '', referencePhoto: null as File | null, type: 'consulta', description: '', referenceImage: '' });
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', message: '' });

  const trackMetric = async (metricKey: 'views' | 'photoClicks' | 'whatsappClicks' | 'agendaClicks', photoId?: string) => {
      try {
          let targetUid = id;
          if (targetUid && targetUid.startsWith('@')) {
              if (artistData && artistData.uid) {
                  targetUid = artistData.uid;
              }
          }
          if (targetUid && !targetUid.startsWith('@')) {
              const { doc, updateDoc, increment } = await import('firebase/firestore');
              const statRef = doc(db, 'users', targetUid, 'stats', 'metrics');
              
              const updates: any = {
                  [metricKey]: increment(1),
                  lastUpdated: new Date()
              };
              
              await updateDoc(statRef, updates).catch(() => {});
          }
      } catch(e) {}
  };
  
  useEffect(() => {
      if (!sessionStorage.getItem('profileViewed')) {
          sessionStorage.setItem('profileViewed', 'true');
          trackMetric('views');
      }
  }, []);

  useEffect(() => {
    let authUnsub = () => {};
    let isMounted = true;
    
    const loadProfileData = async (authUid: string | undefined) => {
        let targetId = id;
        if (!targetId) targetId = authUid;
        if (!targetId) targetId = localStorage.getItem('demoUserId');
        if (!targetId) targetId = 'anonymous_demo';
        
        try {
            if (!artistData) setIsProfileLoading(true);
            if (allTattoos.length === 0) setIsTattoosLoading(true);
            
            let artistUid = targetId;
            let currentArtistData = null;
            let currentArtistDocId = null;

            // Resolve ID if it's a tag
            if (artistUid.startsWith('@') || artistUid.length < 20) {
                let tag = artistUid.startsWith('@') ? artistUid : '@' + artistUid;
                const q = query(collection(db, 'users'), where('userTag', '==', tag));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    artistUid = snap.docs[0].id;
                    currentArtistData = snap.docs[0].data();
                    currentArtistDocId = artistUid;
                }
            } 
            
            // Now that we definitely have the UID, we can fetch BOTH artist profile (if we don't have it yet) and tattoos in parallel using Promise.all!
            const promises = [];
            
            if (!currentArtistData && artistUid !== 'anonymous_demo' && artistUid !== 'demo') {
                promises.push(getDoc(doc(db, 'users', artistUid)).then(docSnap => {
                    if (docSnap.exists()) {
                        currentArtistData = docSnap.data();
                        currentArtistDocId = docSnap.id;
                    }
                }));
            } else {
                promises.push(Promise.resolve());
            }


            // Start Tattoos Query Independently
            const fetchTattoos = async () => {
                try {
                    const qTattoos = query(
                        collection(db, 'photos'),
                        where('createdBy', '==', artistUid),
                        orderBy('createdAt', 'desc'),
                        limit(12)
                    );
                    const tattoosSnapshot = await getDocs(qTattoos);
                    if (isMounted) {
                        if (tattoosSnapshot.docs.length > 0) {
                            setLastDoc(tattoosSnapshot.docs[tattoosSnapshot.docs.length - 1]);
                        }
                        if (tattoosSnapshot.docs.length < 12) {
                            setHasMore(false);
                        }
                        let finalPhotos: any[] = [];
                        finalPhotos = tattoosSnapshot.docs.map(doc => {
                            const data = doc.data();
                            return {
                                id: doc.id,
                                src: data.url || data.imageUrl || data.src,
                                previewUrl: data.previewUrl,
                                thumbnailUrl: data.thumbnailUrl,
                                alt: data.info || data.title,
                                title: data.title || 'Foto de Tatuaje',
                                categories: data.tags || data.categories || ['Portfolio'],
                                filters: data.filters || [],
                                hours: data.hours,
                                sessions: data.sessions,
                                size: data.size,
                                pinnedOrder: data.pinnedOrder,
                                originalFallbackId: data.originalFallbackId
                            };
                        });
                        
                        let isDemoUser = false;
                        if (artistUid === '@victor_ink' || artistUid === 'victor_ink' || artistUid === 'demo' || artistUid === '@demo' || artistUid === 'anonymous_demo') isDemoUser = true;
                        if (currentArtistData && (currentArtistData.userTag === '@demo' || currentArtistData.userTag === '@victor_ink' || currentArtistData.userTag === 'victor_ink' || currentArtistData.userTag === 'demo')) {
                            isDemoUser = true;
                        }
                        if (isDemoUser) {
                            const limitedFallback = DEMO_FALLBACK_PHOTOS.slice(0, 5);
                            const deletedFallbacks = JSON.parse(localStorage.getItem('deletedFallbacks') || '[]');
                            const addedFallbackPhotos = limitedFallback.filter(f => !finalPhotos.some(p => p.originalFallbackId === f.id) && !deletedFallbacks.includes(f.id));
                            finalPhotos = [...finalPhotos, ...addedFallbackPhotos];
                        }
                        
                        const sharedPhotoId = searchParams.get('obra');
                        if (sharedPhotoId && !finalPhotos.find(p => p.id === sharedPhotoId)) {
                            // Check if it's a fallback photo first
                            const fbMatch = DEMO_FALLBACK_PHOTOS.find(f => f.id === sharedPhotoId);
                            if (fbMatch) {
                                finalPhotos.unshift(fbMatch);
                            } else {
                                try {
                                    const { doc, getDoc } = await import('firebase/firestore');
                                    const pDoc = await getDoc(doc(db, 'photos', sharedPhotoId));
                                    if (pDoc.exists()) {
                                        const pData = pDoc.data();
                                        finalPhotos.unshift({
                                            id: pDoc.id,
                                            src: pData.url || pData.imageUrl || pData.src,
                                            previewUrl: pData.previewUrl,
                                            thumbnailUrl: pData.thumbnailUrl,
                                            alt: pData.alt || pData.title || '',
                                            title: pData.title || '',
                                            categories: pData.tags || pData.categories || [],
                                            hours: pData.hours || 0,
                                            sessions: pData.sessions || 1,
                                            size: pData.size || '',
                                            pinnedOrder: pData.pinnedOrder
                                        });
                                    }
                                } catch (e) {}
                            }
                        }

                        finalPhotos.sort((a, b) => {
                            const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;
                            const bPinned = typeof b.pinnedOrder === 'number' && b.pinnedOrder > 0;
                            if (aPinned && bPinned) return a.pinnedOrder - b.pinnedOrder;
                            if (aPinned) return -1;
                            if (bPinned) return 1;
                            return 0;
                        });
                        
                        setAllTattoos(finalPhotos);
                        try {
                            localStorage.setItem('demoAllTattoos_' + artistUid, JSON.stringify(finalPhotos));
                        } catch(e) {}
                        setIsTattoosLoading(false);
                    }
                } catch(e) {
                    if(isMounted) setIsTattoosLoading(false);
                }
            };
            
            promises.push(fetchTattoos());

            await Promise.all(promises);

            if (isMounted) {
                if (currentArtistData) {
                    const data = { ...currentArtistData, uid: currentArtistDocId };
                    setArtistData(data);
                    globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], artistData: data };
                    try {
                        localStorage.setItem('demoArtistData_' + artistUid, JSON.stringify(data));
                    } catch(e) {}
                } else if (targetId === 'demo' || targetId === 'anonymous_demo') {
                    const saved = localStorage.getItem('demoArtistData_demo');
                    if (saved) {
                        try {
                            const parsed = JSON.parse(saved);
                            currentArtistData = parsed;
                            setArtistData(parsed);
                        } catch (e) {}
                    }
                }
                setIsProfileLoading(false);
            }
        } catch (error) {

            console.error(error);
            if (isMounted) {
                setIsProfileLoading(false);
                setIsTattoosLoading(false);
            }
        }
    };

    if (id) {
        loadProfileData(undefined);
    } else {
        const localUid = localStorage.getItem('demoUserId');
        if (localUid) {
            loadProfileData(localUid);
        } else {
            authUnsub = onAuthStateChanged(auth, (user) => {
                loadProfileData(user?.uid);
            });
        }
    }
    
    const handleProfileDataChanged = () => {
        loadProfileData(localStorage.getItem('demoUserId') || auth.currentUser?.uid);
    };
    window.addEventListener('profileDataChanged', handleProfileDataChanged);
    
    return () => {
        isMounted = false;
        authUnsub();
        window.removeEventListener('profileDataChanged', handleProfileDataChanged);
    };
  }, [id]);


  const categoryCounts = allTattoos.reduce((acc, tattoo) => {
    (tattoo.categories || []).forEach((cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
    });
    return acc;
  }, {});
  const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);
  const filterCategories = ["All", ...sortedCategories];

  const getFilterStr = (filters: any) => {
    let filterStr = '';
    if (filters) {
        const { activePreset, contrast, brightness, blackIntensity } = filters;
        const isAnyManualActive = contrast?.active || brightness?.active || blackIntensity?.active;
        if (activePreset && !isAnyManualActive) {
            if (activePreset === 'tinta_negra') filterStr = 'contrast(125%) brightness(95%) grayscale(15%)';
            if (activePreset === 'color') filterStr = 'contrast(110%) brightness(105%) saturate(130%)';
            if (activePreset === 'piel') filterStr = 'contrast(95%) brightness(105%) saturate(90%)';
            if (activePreset === 'blanco_y_negro') filterStr = 'grayscale(100%) contrast(130%)';
        } else {
            if (contrast?.active) filterStr += `contrast(${contrast.value * 2}%) `;
            if (brightness?.active) filterStr += `brightness(${brightness.value * 2}%) `;
            if (blackIntensity?.active) filterStr += `grayscale(${blackIntensity.value}%) `;
        }
    }
    return filterStr.trim();
  };

  const filteredTattoos = allTattoos.filter(t => activeCategory === "All" || t.categories.includes(activeCategory));
  const visibleTattoos = filteredTattoos;

  const loadMoreTattoos = async () => {
    if (!hasMore || !lastDoc || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
        const uid = artistData?.uid || artistData?.id || resolveTargetId();
        const { collection, query, where, orderBy, limit, startAfter, getDocs } = await import('firebase/firestore');
        const qTattoos = query(
            collection(db, 'photos'),
            where('createdBy', '==', uid),
            orderBy('createdAt', 'desc'),
            startAfter(lastDoc),
            limit(12)
        );
        const tattoosSnapshot = await getDocs(qTattoos);
        
        if (tattoosSnapshot.docs.length > 0) {
            setLastDoc(tattoosSnapshot.docs[tattoosSnapshot.docs.length - 1]);
        }
        if (tattoosSnapshot.docs.length < 12) {
            setHasMore(false);
        }
        
        let newPhotos = tattoosSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                src: data.url || data.imageUrl || data.src,
                previewUrl: data.previewUrl,
                thumbnailUrl: data.thumbnailUrl,
                alt: data.info || data.title,
                title: data.title || 'Foto de Tatuaje',
                categories: data.tags || data.categories || ['Portfolio'],
                filters: data.filters || [],
                hours: data.hours,
                sessions: data.sessions,
                size: data.size,
                pinnedOrder: data.pinnedOrder,
                originalFallbackId: data.originalFallbackId
            };
        });
        
        setAllTattoos(prev => [...prev, ...newPhotos]);
    } catch(e) {
        console.error("Error loading more tattoos", e);
    } finally {
        setIsLoadingMore(false);
    }
  };

  const openModal = (index: number) => {
    const photoId = visibleTattoos[index]?.id;
    if (photoId) {
      setSearchParams({ obra: photoId }); // Pushes to history so back button closes modal
    } else {
      setActiveTattooIndex(index);
      setModalOpen(true);
      trackMetric('photoClicks', photoId);
      document.body.classList.add('overflow-hidden');
    }
  };

  const closeModal = () => {
    if (searchParams.get('obra')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('obra');
      setSearchParams(newParams, { replace: true });
    } else {
      setModalOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newIndex = activeTattooIndex > 0 ? activeTattooIndex - 1 : visibleTattoos.length - 1;
    const photoId = visibleTattoos[newIndex]?.id;
    if (photoId) {
      setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('obra', photoId); return p; }, { replace: true });
    } else {
      setActiveTattooIndex(newIndex);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newIndex = activeTattooIndex < visibleTattoos.length - 1 ? activeTattooIndex + 1 : 0;
    const photoId = visibleTattoos[newIndex]?.id;
    if (photoId) {
      setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('obra', photoId); return p; }, { replace: true });
    } else {
      setActiveTattooIndex(newIndex);
    }
  };

  useEffect(() => {
    const photoId = searchParams.get('obra');
    if (photoId && allTattoos.length > 0) {
      const vIndex = visibleTattoos.findIndex(t => t.id === photoId);
      if (vIndex !== -1) {
        if (!modalOpen || activeTattooIndex !== vIndex) {
          setActiveTattooIndex(vIndex);
          trackMetric('photoClicks', photoId);
          if (!modalOpen) {
            setModalOpen(true);
            document.body.classList.add('overflow-hidden');
          }
        }
      } else {
        const aIndex = allTattoos.findIndex(t => t.id === photoId);
        if (aIndex !== -1) {
          if (activeCategory !== "All") setActiveCategory("All");
        }
      }
    } else if (!photoId && modalOpen) {
      console.log('Closing modal because photoId is null');
      setModalOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  }, [searchParams, allTattoos, visibleTattoos, modalOpen, activeTattooIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        const newIndex = activeTattooIndex < visibleTattoos.length - 1 ? activeTattooIndex + 1 : 0;
        const photoId = visibleTattoos[newIndex]?.id;
        if (photoId) {
          setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('obra', photoId); return p; }, { replace: true });
        }
      } else if (e.key === 'ArrowLeft') {
        const newIndex = activeTattooIndex > 0 ? activeTattooIndex - 1 : visibleTattoos.length - 1;
        const photoId = visibleTattoos[newIndex]?.id;
        if (photoId) {
          setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('obra', photoId); return p; }, { replace: true });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, activeTattooIndex, visibleTattoos, setSearchParams]);



  useEffect(() => {
    if (modalOpen && visibleTattoos.length > 0) {
      const nextIndex = activeTattooIndex < visibleTattoos.length - 1 ? activeTattooIndex + 1 : 0;
      const prevIndex = activeTattooIndex > 0 ? activeTattooIndex - 1 : visibleTattoos.length - 1;
      
      const preloadUrl = (url) => {
        if (url) {
          const img = new Image();
          img.src = url;
        }
      };
      
      // Preload next
      preloadUrl(visibleTattoos[nextIndex]?.previewUrl || visibleTattoos[nextIndex]?.src);
      // Preload prev
      preloadUrl(visibleTattoos[prevIndex]?.previewUrl || visibleTattoos[prevIndex]?.src);
    }
  }, [modalOpen, activeTattooIndex, visibleTattoos]);

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('nav');
      if (nav) {
        if (window.scrollY > 50) {
          nav.classList.add('py-2');
          nav.classList.remove('py-4');
        } else {
          nav.classList.add('py-4');
          nav.classList.remove('py-2');
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let isExplicitDemoTarget = isTargetDemo();
  let isDemoProfile = isExplicitDemoTarget;
  if (artistData && (artistData.userTag === '@demo' || artistData.userTag === '@victor_ink' || artistData.userTag === 'victor_ink' || artistData.userTag === 'demo')) {
      isDemoProfile = true;
  }
  
  // Create safe fallbacks based on target
  const defaultName = artistData?.displayName || (isExplicitDemoTarget ? "Victor Ink" : "Cargando...");
  const defaultBio = artistData?.bio || (isExplicitDemoTarget ? "Conoce a este increíble artista del tatuaje y explora su portafolio en Turnos Tattoo." : "Cargando...");
  const defaultBg = artistData?.backgroundPhotos?.[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuBiWtwSf0Fh3AWm01LAlMfj3JGoOdHldaVkVIRDRpbavMRKQEt_SI7cvqZB7R56dQt7nuInHJM7V0a74racFxJT0E12v57KMBnC09rQOtg5YVpvOdglwy8KnhHl1H0tFedvuBum6LD2ADyKGFqdnQ3lUJqIhOZj6bJPzlLI4S7L2n9tqn9wZ6t8smG60s2wvnHM3NabsjD_rMrUmix943Tdd_CAZDTFaQeq5FEq8IXpsVkSLkJ24K0VpV9R4GRF2SDH8cwWPwwNjXI";
  const defaultAvatar = artistData?.profilePhotoUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0";


  

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen">
      <Helmet>
        <title>{artistData?.displayName ? `${artistData.displayName} - Turnos Tattoo` : 'Perfil de Artista - Turnos Tattoo'}</title>
        <meta name="description" content={artistData?.bio || defaultBio} />
        <meta property="og:title" content={artistData?.displayName ? `${artistData.displayName} - Turnos Tattoo` : 'Perfil de Artista - Turnos Tattoo'} />
        <meta property="og:description" content={artistData?.bio || 'Explora el portafolio y reserva tu turno.'} />
        <meta property="og:image" content={defaultAvatar} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href={defaultAvatar} />
        <link rel="apple-touch-icon" href={defaultAvatar} />
      </Helmet>
      <main className="pb-8 md:pb-16">
        <div className="top-0 left-0 z-40 px-3 py-1.5 bg-black/60 backdrop-blur-md fixed">
          <span className="font-label-md text-label-md font-extrabold text-on-surface uppercase tracking-tighter">Turnos <span className="text-primary">Tattoo</span></span>
        </div>
        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-96 overflow-hidden bg-surface-container">
          <OptimizedImage
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
             highResUrl={defaultBg}
             alt="Banner"
             useIntersectionObserver={false}
             loading="eager"
          />
          {/* Filtro oscuro para no perder la estética con fotos claras */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent"></div>
        </section>

        {/* Profile Header Section */}
        <section className="relative px-gutter -mt-12 md:-mt-20 flex flex-col items-center text-center z-10">
          {/* Profile Photo */}
          <div className="relative p-1 bg-background rounded-full mb-2">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary">
              <OptimizedImage className="w-full h-full object-cover" alt="Artist profile" highResUrl={defaultAvatar} useIntersectionObserver={false} loading="eager" />
            </div>
          </div>

          {/* Artist Info */}
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-extrabold uppercase tracking-tight text-3xl mb-4">{artistData?.displayName || defaultName}</h1>
          {(() => {
            const tags = ((artistData?.specialtyTags && artistData.specialtyTags.length > 0) ? artistData.specialtyTags : ['Realismo', 'Black & Grey']).slice(0, 3);
            const count = tags.length;
            let containerClass = "flex justify-center mb-4 w-full px-2 md:px-4 ";
            if (count === 1) containerClass += "gap-2";
            else if (count === 2) containerClass += "gap-6 md:gap-8";
            else containerClass += "gap-2 justify-between md:justify-center md:gap-4";
            
            return (
              <div className={containerClass}>
                {tags.map((tag: string, index: number) => (
                  <span key={index} className="px-2 py-1 md:px-3 md:py-1 bg-surface-container border border-outline-variant font-caption text-[9px] md:text-xs text-on-surface-variant uppercase tracking-widest whitespace-nowrap truncate max-w-[32%] md:max-w-none text-center flex-1 md:flex-none">
                    {tag}
                  </span>
                ))}
              </div>
            );
          })()}

          {/* Social & Stats */}
          <div className="flex justify-center mt-4 mb-4">
            <div className="flex items-center gap-2">
              
              { (artistData?.instagram || isDemoProfile) && (
              <a className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white" href={artistData?.instagram || "https://instagram.com"} aria-label="Instagram">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM12 15C10.34 15 9 13.66 9 12C9 10.34 10.34 9 12 9C13.66 9 15 10.34 15 12C15 13.66 13.66 15 12 15ZM17 6C17 6.55 16.55 7 16 7C15.45 7 15 6.55 15 6C15 5.45 15.45 5 16 5C16.55 5 17 5.45 17 6ZM12 2.16C15.2 2.16 15.58 2.17 16.89 2.23C18.11 2.29 18.77 2.49 19.22 2.66C19.82 2.9 20.25 3.2 20.7 3.65C21.15 4.1 21.46 4.53 21.69 5.13C21.87 5.58 22.07 6.24 22.13 7.46C22.19 8.77 22.2 9.15 22.2 12C22.2 14.85 22.19 15.23 22.13 16.54C22.07 17.76 21.87 18.42 21.69 18.87C21.46 19.47 21.15 19.9 20.7 20.35C20.25 20.8 19.82 21.1 19.22 21.34C18.77 21.51 18.11 21.71 16.89 21.77C15.58 21.83 15.2 21.84 12 21.84C8.8 21.84 8.42 21.83 7.11 21.77C5.89 21.71 5.23 21.51 4.78 21.34C4.18 21.1 3.75 20.8 3.3 20.35C2.85 19.9 2.54 19.47 2.31 18.87C2.13 18.42 1.93 17.76 1.87 16.54C1.81 15.23 1.8 14.85 1.8 12C1.8 9.15 1.81 8.77 1.87 7.46C1.93 6.24 2.13 5.58 2.31 5.13C2.54 4.53 2.85 4.1 3.3 3.65C3.75 3.2 4.18 2.9 4.78 2.66C5.23 2.49 5.89 2.29 7.11 2.23C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33 0.01 7.05 0.07C5.77 0.13 4.9 0.33 4.14 0.63C3.36 0.93 2.69 1.32 2.02 1.99C1.35 2.66 0.96 3.33 0.66 4.11C0.36 4.87 0.16 5.74 0.1 7.02C0.04 8.3 0.03 8.71 0.03 11.97C0.03 15.23 0.04 15.64 0.1 16.92C0.16 18.2 0.36 19.07 0.66 19.83C0.96 20.61 1.35 21.28 2.02 21.95C2.69 22.62 3.36 23.01 4.14 23.31C4.9 23.61 5.77 23.81 7.05 23.87C8.33 23.93 8.74 23.94 12 23.94C15.26 23.94 15.67 23.93 16.95 23.87C18.23 23.81 19.1 23.61 19.86 23.31C20.64 23.01 21.31 22.62 21.98 21.95C22.65 21.28 23.04 20.61 23.34 19.83C23.64 19.07 23.84 18.2 23.9 16.92C23.96 15.64 23.97 15.23 23.97 11.97C23.97 8.71 23.96 8.3 23.9 7.02C23.84 5.74 23.64 4.87 23.34 4.11C23.04 3.33 22.65 2.66 21.98 1.99C21.31 1.32 20.64 0.93 19.86 0.63C19.1 0.33 18.23 0.13 16.95 0.07C15.67 0.01 15.26 0 12 0Z"/>
                              </svg>
                            </a>
            )}
              { (artistData?.tiktok || isDemoProfile) && (
              <a className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white" href={artistData?.tiktok || "https://tiktok.com"} aria-label="TikTok">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.66-5.46-.22-2.39.54-4.78 2.15-6.44 1.8-1.88 4.37-2.65 6.9-2.21 1.02.17 2.04.5 2.95 1.05V10.3c-.52-.3-1.08-.54-1.68-.69-1.2-.3-2.5-.15-3.62.4-1.3.62-2.22 1.8-2.54 3.2-.23 1.03-.02 2.14.53 3.02.58.94 1.53 1.57 2.6 1.77 1.6.31 3.3-.23 4.33-1.47.82-.99 1.2-2.3 1.23-3.6.08-3.92.03-7.85.03-11.78.01-.39-.02-.79.03-1.18z"/>
                              </svg>
                            </a>
            )}
              { (artistData?.facebook || isDemoProfile) && (
              <a className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white" href={artistData?.facebook || "https://facebook.com"} aria-label="Facebook">
                              <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                              </svg>
                            </a>
            )}
              <button type="button"
                className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white" 
                aria-label="Compartir perfil"
                onClick={async () => {
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: artistData?.displayName || 'Perfil de Artista',
                        url: (id ? window.location.href : (artistData?.userTag ? window.location.origin + '/' + (artistData.userTag.startsWith('@') ? artistData.userTag : '@' + artistData.userTag) : window.location.href))
                      });
                    } else {
                      await navigator.clipboard.writeText((id ? window.location.href : (artistData?.userTag ? window.location.origin + '/' + (artistData.userTag.startsWith('@') ? artistData.userTag : '@' + artistData.userTag) : window.location.href)));
                      alert('URL copiada al portapapeles');
                    }
                  } catch (err: any) {
                    if (err.name !== 'AbortError' && !err.message?.includes('canceled') && err.name !== 'NotAllowedError') {
                      try {
                        await navigator.clipboard.writeText((id ? window.location.href : (artistData?.userTag ? window.location.origin + '/' + (artistData.userTag.startsWith('@') ? artistData.userTag : '@' + artistData.userTag) : window.location.href)));
                        alert('URL copiada al portapapeles');
                      } catch (fallbackErr) {
                         console.log('Compartir cancelado o no disponible.');
                      }
                    }
                  }
                }}
              >
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <div className="flex justify-center mb-8 px-gutter mt-4 relative z-30">
          <button type="button"
            className={`w-full max-w-md py-3 px-6 font-label-md text-label-md font-extrabold uppercase tracking-widest shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-4 relative overflow-hidden bg-primary text-on-primary hover:bg-[#065f46] active:scale-95 shimmer-btn`}
            style={{ touchAction: 'manipulation' }}
            onClick={() => {
              if (artistData?.isAvailable !== false) {
                if (artistData?.whatsapp) {
                  const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                  trackMetric('whatsappClicks');
                  const message = `Hola ${artistData?.displayName || 'artista'}, vengo de tu página web. Tengo una duda, pregunta o idea para un tatuaje...`;
                  window.open(`https://wa.me/549${num}?text=${encodeURIComponent(message)}`, '_blank');
                }
              } else {
                setWaitlistModalOpen(true);
              }
            }}
          >
            {artistData?.isAvailable !== false ? (
              <>
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"></path></svg>
                Quiero un turno
              </>
            ) : (
              'Lista Llena Agéndate'
            )}
          </button>
        </div>

        <section className="mt-12 px-gutter max-w-container-max mx-auto ">
          {/* Filter Tags */}
          <div className="relative mb-12">
            <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto hide-scrollbar pb-4 border-b border-outline-variant/10 pr-12 md:pr-0">
              {filterCategories.map(cat => (
                <button type="button"
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setShowMore(false); }}
                  className={`whitespace-nowrap px-4 py-2 border rounded font-label-md text-[10px] md:text-xs uppercase tracking-widest font-bold transition-colors ${
                    activeCategory === cat 
                      ? 'bg-primary/20 text-primary border-primary/30' 
                      : 'border-outline-variant/30 text-on-surface-variant hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Indicador de scroll táctil celular */}
            <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none flex justify-end items-center md:hidden">
              <span className="material-symbols-outlined text-on-surface-variant animate-pulse pr-1 text-xl opacity-60">swipe_left</span>
            </div>
          </div>

          {/* Masonry Grid */}

          {isProfileLoading || (isTattoosLoading && visibleTattoos.length === 0) ? (
            <div className="grid grid-cols-3 gap-2 w-full animate-pulse">
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
                <div className="aspect-square bg-surface-container border border-white/5" />
            </div>
          ) : (
          <div className="grid grid-cols-3 gap-2">

            {visibleTattoos.map((tattoo, index) => (
              <div key={tattoo.id} className={`group relative overflow-hidden border border-white/5 ${index === 0 ? 'interactive-cue' : ''}`}>
                <OptimizedImage 
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer object-cover aspect-square" 
                  alt={tattoo.alt} 
                  onClick={() => openModal(index)} 
                  lowResUrl={tattoo.thumbnailUrl}
                  highResUrl={tattoo.thumbnailUrl || tattoo.previewUrl || tattoo.src} 
                  style={{ filter: getFilterStr(tattoo.filters) }}
                  useIntersectionObserver={true}
                />
                {index === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-1 pointer-events-none interactive-overlay bg-black/40">
                    <span className="material-symbols-outlined text-white text-3xl">touch_app</span>
                    <span className="text-white text-[10px] uppercase font-bold tracking-wider">Ver detalle</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          )}

          <div className="flex justify-center mt-12 gap-4">
            {hasMore && (
              <button type="button"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all uppercase tracking-widest border-b border-outline-variant hover:border-primary py-2 font-bold flex items-center gap-2" 
                onClick={loadMoreTattoos}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : null}
                {isLoadingMore ? 'Cargando...' : 'Cargar más'}
              </button>
            )}
          </div>
        </section>

        {/* Studio Location Section */}
        {artistData?.hasPhysicalStudio !== false && (
          <section className="mt-section-gap px-gutter max-w-container-max mx-auto ">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4 font-bold uppercase tracking-tight">{artistData?.studioName || "El Estudio"}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">{artistData?.studioDescription || "Ubicado en el corazón del distrito de diseño, nuestro espacio combina la precisión técnica con una atmósfera de galería de arte."}</p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                    <div>
                      <p className="font-label-md text-on-surface uppercase font-bold">Dirección</p>
                      <p className="text-on-surface-variant">{artistData?.studioAddress || "Calle del Arte 1234, Palermo, CABA"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-primary text-2xl">schedule</span>
                    <div>
                      <p className="font-label-md text-on-surface uppercase font-bold">Horarios</p>
                      <p className="text-on-surface-variant">{artistData?.studioHours || "Mar - Sáb: 12:00 - 20:00"}</p>
                    </div>
                  </div>
                </div>
              </div>
              <a 
                href={artistData?.mapLink || "https://maps.google.com"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-48 md:h-64 w-full mx-auto grayscale border border-outline-variant overflow-hidden hover:grayscale-0 hover:border-primary transition-all duration-500 block relative group"
              >
                <div className="w-full h-full bg-surface-container flex items-center justify-center relative">
                  <OptimizedImage className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-500" alt="Map" highResUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuC1MG2dFZwUDUPDIxG_Aln6x7qj7PTFU-nq71Kz_QrgZTsCKbHPWFjx1ECNLxh36R0plsldSaxtyWi1PPUfx4GZVICAiwQXgKFS91w9QB5JPN2AUgGXuwSqPAQHVv_Rrra-Rqlu99MtTqyjx4iIJbH0Xe-XAk9kQyS0DhXbqymKwhMbLjhlxQ9vs6vSgvupRUsYJkHkoWe_Sp9AOCXN0tXfooiYuXTp3PQK0-nvaoIExJsH7e4H5n1iynsgSXS0Bc702RScJbs0uf8" useIntersectionObserver={true} />
                  <div className="relative z-10 text-center p-6 border border-primary/30 bg-surface/80 backdrop-blur-md group-hover:bg-primary/90 group-hover:border-primary group-hover:text-on-primary transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl text-primary mb-2 group-hover:text-on-primary transition-colors">map</span>
                    <p className="font-label-md text-label-md text-on-surface font-bold group-hover:text-on-primary transition-colors">Abrir en Google Maps</p>
                  </div>
                </div>
              </a>
            </div>
          </section>
        )}

        <section className="mt-section-gap mb-section-gap px-gutter max-w-container-max mx-auto ">
          <div className="bg-surface-container p-8 border border-outline-variant/20 flex flex-col gap-8 items-center text-center">
            <OptimizedImage className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-primary shrink-0" alt={artistData?.displayName || "Artist"} highResUrl={defaultAvatar} useIntersectionObserver={true} />
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4 font-bold uppercase tracking-tight">Sobre Mí</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">{artistData?.bio || "Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente."}</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-section-gap px-gutter max-w-container-max mx-auto ">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 font-bold uppercase tracking-tight text-center">Preguntas Frecuentes</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {(artistData?.faqs || defaultFaqs).map((faq: any, index: number) => (
                <details key={index} className="bg-surface-container border border-outline-variant/30 group">
                <summary className="font-label-md text-on-surface uppercase font-bold p-6 cursor-pointer flex justify-between items-center list-none">
                    {faq.question}
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="p-6 pt-0 text-on-surface-variant font-body-md">
                    <p>{faq.answer}</p>
                </div>
                </details>
            ))}
          </div>
        </section>

        </main>
      {/* Footer */}
      <footer className="w-full py-16 px-gutter flex flex-col items-center gap-8 text-center bg-surface-container-lowest border-t border-outline-variant/10 mt-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold uppercase tracking-tighter">Turnos <span className="text-primary">Tattoo</span></span>
          <button type="button"
            onClick={() => {
              const btn = document.getElementById('quiero-mi-pagina-btn');
              if (btn) btn.classList.add('animate-button-pop');
              setTimeout(() => {
                window.scrollTo(0, 0);
                navigate('/');
              }, 300);
            }}
            id="quiero-mi-pagina-btn"
            className="px-8 py-3 bg-primary text-on-primary font-label-md text-label-md uppercase font-bold hover:bg-[#065f46] transition-all duration-300 shadow-[0_0_20px_rgba(5,77,68,0.3)] active:scale-90"
          >
            QUIERO MI PÁGINA
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <button type="button" className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setTermsModalOpen(true)}>Términos</button>
          <button type="button" className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setPrivacyModalOpen(true)}>Privacidad</button>
          <button type="button" className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setContactModalOpen(true)}>Contacto</button>
        </div>
        <p className="font-caption text-caption uppercase tracking-widest text-on-surface-variant opacity-60">© 2026 Turnos Tattoo. All rights reserved.</p>
      </footer>

      {/* Modal */}
      {modalOpen && visibleTattoos.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-2 md:p-8 transition-opacity duration-300 overscroll-none">
          <div className="absolute inset-0 z-0 cursor-pointer" onClick={closeModal}></div>
          <div className="relative z-10 w-full max-w-6xl h-[100dvh] md:h-auto md:max-h-[95vh] md:min-h-[80vh] flex flex-col bg-surface-container border border-outline-variant/20 shadow-2xl transform transition-transform duration-300">
            <button type="button" className="absolute top-1 right-1 md:top-3 md:right-3 z-[110] p-1 md:p-1.5 text-on-surface hover:text-primary transition-colors duration-200 focus:outline-none bg-surface/50 backdrop-blur-sm rounded-lg" onClick={closeModal}>
              <span className="material-symbols-outlined text-lg md:text-xl">close</span>
            </button>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row relative">
              
              <div className="w-full h-[45vh] md:h-auto md:w-2/3 bg-black flex items-center justify-center p-2 md:p-4 relative overflow-hidden flex-shrink-0 group">
                {/* Navigation Left */}
                <button type="button"
                  className="hidden md:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-[110] w-10 h-10 md:w-12 md:h-12 items-center justify-center p-0 text-white/90 bg-black/40 md:bg-black/20 hover:bg-black/70 border border-white/20 backdrop-blur-md rounded-full transition-all duration-300 focus:outline-none hover:scale-110 shadow-lg md:opacity-0 md:group-hover:opacity-100" 
                  onClick={prevPhoto}
                >
                  <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_left</span>
                </button>
                
                {/* Navigation Right */}
                <button type="button"
                  className="hidden md:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-[110] w-10 h-10 md:w-12 md:h-12 items-center justify-center p-0 text-white/90 bg-black/40 md:bg-black/20 hover:bg-black/70 border border-white/20 backdrop-blur-md rounded-full transition-all duration-300 focus:outline-none hover:scale-110 shadow-lg md:opacity-0 md:group-hover:opacity-100" 
                  onClick={nextPhoto}
                >
                  <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_right</span>
                </button>


                
                {/* Main Image */}
                <OptimizedImage 
                  key={visibleTattoos[activeTattooIndex].id}
                  alt={visibleTattoos[activeTattooIndex].alt} 
                  className="max-w-full max-h-[45vh] md:max-h-[85vh] object-contain animate-fade-in relative z-10 shadow-2xl" 
                  lowResUrl={visibleTattoos[activeTattooIndex].previewUrl || visibleTattoos[activeTattooIndex].thumbnailUrl}
                  highResUrl={visibleTattoos[activeTattooIndex].src} 
                  style={{ filter: getFilterStr(visibleTattoos[activeTattooIndex].filters) }}
                  useIntersectionObserver={false}
                  loading="eager"
                />
              </div>

              <div className="w-full md:w-1/3 p-4 md:p-6 flex flex-col flex-1 border-l border-outline-variant/10 overflow-y-auto touch-pan-y overscroll-contain">
                <div className="flex flex-col h-full md:h-auto min-h-full">
                  <div className="flex flex-col justify-start space-y-4 md:mt-4 shrink-0">
                    <div className="text-center flex flex-col items-center w-full">
                      <div className="relative flex items-center justify-center w-full min-h-[32px] mb-4">
                        <button type="button"
                          className="absolute left-0 top-1/2 -translate-y-1/2 md:hidden flex-shrink-0 flex items-center justify-center w-8 h-8 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 rounded-full transition-colors" 
                          onClick={prevPhoto}
                        >
                          <span className="material-symbols-outlined text-xl">chevron_left</span>
                        </button>
                        
                        <div className="w-full px-10 md:px-0 flex flex-wrap items-center justify-center gap-3 md:gap-4">
                          {visibleTattoos[activeTattooIndex].categories.map((cat, idx) => (
                            <div key={idx} className="flex justify-center">
                              <span className="inline-flex items-center justify-center px-4 py-1.5 min-h-[28px] text-[10px] md:text-xs font-bold bg-primary/20 text-primary border border-primary/30 rounded uppercase tracking-widest text-center whitespace-nowrap">
                                {cat}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <button type="button"
                          className="absolute right-0 top-1/2 -translate-y-1/2 md:hidden flex-shrink-0 flex items-center justify-center w-8 h-8 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 rounded-full transition-colors" 
                          onClick={nextPhoto}
                        >
                          <span className="material-symbols-outlined text-xl">chevron_right</span>
                        </button>
                      </div>
                      
                      <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight text-on-surface mb-3">{visibleTattoos[activeTattooIndex].title}</h2>
                      
                      <div className="w-full flex items-center justify-center mb-6 opacity-90 px-4 md:px-0">
                        <div className="h-[3px] flex-1 w-full max-w-[200px] bg-gradient-to-r from-transparent via-primary/60 to-primary rounded-full"></div>
                        <div className="mx-4 w-2.5 h-2.5 rotate-45 border-[1.5px] border-primary bg-primary/20 flex-shrink-0"></div>
                        <div className="h-[3px] flex-1 w-full max-w-[200px] bg-gradient-to-l from-transparent via-primary/60 to-primary rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="mt-2 md:mt-4">
                      <p className="text-center text-on-surface-variant text-xs md:text-sm leading-relaxed">{visibleTattoos[activeTattooIndex].alt}</p>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 md:pt-10 flex flex-col gap-4 md:gap-8 shrink-0">
                    {(visibleTattoos[activeTattooIndex].hours || visibleTattoos[activeTattooIndex].sessions || visibleTattoos[activeTattooIndex].size) && (
                      <div className="flex justify-center md:justify-center flex-wrap gap-4 md:gap-6 w-full border-t border-outline-variant/10 pt-4 md:pt-6">
                        {visibleTattoos[activeTattooIndex].hours && (
                          <div className="flex flex-col items-center justify-center text-center py-1.5 px-2 md:px-4 border border-outline-variant/10 bg-surface-container-high rounded-lg transition-colors hover:bg-surface-container-highest min-w-[80px] md:min-w-[95px]">
                            <span className="material-symbols-outlined text-primary mb-0.5 text-base">schedule</span>
                            <span className="text-[9px] font-bold tracking-widest text-on-surface-variant/70 uppercase">Horas</span>
                            <span className="font-bold text-on-surface text-[11px] mt-0.5">{visibleTattoos[activeTattooIndex].hours}h</span>
                          </div>
                        )}
                        {visibleTattoos[activeTattooIndex].sessions && (
                          <div className="flex flex-col items-center justify-center text-center py-1.5 px-2 md:px-4 border border-outline-variant/10 bg-surface-container-high rounded-lg transition-colors hover:bg-surface-container-highest min-w-[80px] md:min-w-[95px]">
                            <span className="material-symbols-outlined text-primary mb-0.5 text-base">layers</span>
                            <span className="text-[9px] font-bold tracking-widest text-on-surface-variant/70 uppercase">Sesiones</span>
                            <span className="font-bold text-on-surface text-[11px] mt-0.5">{visibleTattoos[activeTattooIndex].sessions}</span>
                          </div>
                        )}
                        {visibleTattoos[activeTattooIndex].size && (
                          <div className="flex flex-col items-center justify-center text-center py-1.5 px-2 md:px-4 border border-outline-variant/10 bg-surface-container-high rounded-lg transition-colors hover:bg-surface-container-highest min-w-[80px] md:min-w-[95px]">
                            <span className="material-symbols-outlined text-primary mb-0.5 text-base">straighten</span>
                            <span className="text-[9px] font-bold tracking-widest text-on-surface-variant/70 uppercase">Tamaño</span>
                            <span className="font-bold text-on-surface text-[11px] mt-0.5">{visibleTattoos[activeTattooIndex].size}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-0">
                      <button type="button"
                        className="w-full py-3 bg-primary text-on-primary font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#065f46] transition-all duration-300 group shadow-lg animate-button-pop"
                        onClick={() => {
                           if (artistData?.isAvailable !== false) {
                               if (artistData?.whatsapp) {
                                   const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                                   trackMetric('whatsappClicks');
                                   const photoId = visibleTattoos[activeTattooIndex].id;
                                   const photoUrl = visibleTattoos[activeTattooIndex].src;
                                   const profileUrl = window.location.origin + window.location.pathname;
                                   const tattooTitle = visibleTattoos[activeTattooIndex].title || visibleTattoos[activeTattooIndex].alt || 'Diseño';
                                   const message = `Hola ${artistData?.displayName || 'artista'}, vengo de tu página web y me encantó este tatuaje. Me gustaría hacerme algo similar o saber más al respecto:\n\nObra: ${profileUrl}?obra=${photoId}`;
                                   window.open(`https://wa.me/549${num}?text=${encodeURIComponent(message)}`, '_blank');
                               }
                           } else {
                               setWaitlistForm({
                                 ...waitlistForm,
                                 type: 'idea',
                                 description: '',
                                 referenceImage: visibleTattoos[activeTattooIndex].src
                               });
                               setWaitlistModalOpen(true);
                           }
                        }}
                      >
                        <span>Quiero este tatuaje</span>
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </button>
                      <p className="text-center text-[10px] uppercase tracking-wider text-on-surface-variant/50 mt-3">Consultá disponibilidad y presupuesto personalizado</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {waitlistModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-md p-6 relative flex flex-col gap-4 overflow-hidden">
            <button type="button"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10"
              onClick={() => {
                setWaitlistModalOpen(false);
                setWaitlistForm({...waitlistForm, referenceImage: ''});
                setWaitlistSuccess(false);
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {waitlistSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-accent/20 flex items-center justify-center mb-2 animate-button-pop">
                  <span className="material-symbols-outlined text-4xl text-emerald-accent">check</span>
                </div>
                <h2 className="font-headline-md text-xl text-on-surface uppercase tracking-tighter">¡Mensaje Enviado!</h2>
                <p className="text-sm text-on-surface-variant text-center max-w-[280px]">
                  El tatuador ha recibido tu solicitud. Te contactará por WhatsApp a la brevedad.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-headline-md text-xl text-on-surface uppercase tracking-tighter">Agéndate en la lista</h2>
                <p className="text-sm text-on-surface-variant bg-surface-variant/50 p-3 border border-outline-variant/30 rounded">
                  El tatuador se encuentra ocupado. Cuando se libere, te enviará un mensaje.
                </p>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Tu nombre</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Juan Pérez"
                    className="bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full"
                    value={waitlistForm.name}
                    onChange={e => setWaitlistForm({...waitlistForm, name: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Tu número de WhatsApp</label>
                  <div className="relative w-full">
                    <input 
                  type="text" 
                  placeholder="11..."
                  className="bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full pr-10"
                  value={waitlistForm.phone}
                  onChange={e => setWaitlistForm({...waitlistForm, phone: e.target.value})}
                />
                {waitlistForm.phone.replace(/[^0-9]/g, '').length === 10 && (
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#b1efe2]">check_circle</span>
                )}
              </div>
            </div>
            {!waitlistForm.referenceImage && (
              <div className="flex flex-col gap-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Título (Consulta o Idea)</label>
                <select 
                  className="bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full cursor-pointer appearance-none"
                  value={waitlistForm.type}
                  onChange={e => setWaitlistForm({...waitlistForm, type: e.target.value})}
                >
                  <option value="consulta">Consulta general</option>
                  <option value="idea">Tengo una idea</option>
                </select>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Descripción</label>
              <textarea 
                rows={3}
                placeholder="Describa su consulta o idea de tatuaje, tamaño y zona del cuerpo."
                className="bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full resize-none"
                value={waitlistForm.description}
                onChange={e => setWaitlistForm({...waitlistForm, description: e.target.value})}
              ></textarea>
            </div>
            
            {waitlistForm.referenceImage ? (
              <div className="flex flex-col gap-2 mt-1">
                <label className="font-label-sm text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Tatuaje de referencia seleccionado</label>
                <div className="flex gap-4 items-start bg-surface-variant/30 p-2 rounded border border-outline-variant/30">
                  <OptimizedImage highResUrl={waitlistForm.referenceImage || ""} alt="Referencia" className="w-20 h-20 object-cover rounded border border-border-muted shrink-0" useIntersectionObserver={true} />
                  <div className="flex flex-col gap-1.5 overflow-hidden justify-center h-full">
                    {(() => {
                      const refTattoo = allTattoos.find(t => t.src === waitlistForm.referenceImage);
                      if (refTattoo) {
                        return (
                          <>
                            <h4 className="text-sm font-bold text-on-surface truncate leading-tight">{refTattoo.title}</h4>
                            <div className="flex flex-wrap gap-1">
                              {refTattoo.categories.map((cat, idx) => (
                                <span key={idx} className="text-[9px] uppercase tracking-wider bg-surface-variant text-on-surface px-1.5 py-0.5 rounded border border-outline-variant/50">{cat}</span>
                              ))}
                            </div>
                            <p className="text-xs text-on-surface-variant line-clamp-2 leading-snug">{refTattoo.alt}</p>
                          </>
                        );
                      }
                      return (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Imagen adjuntada</p>
                          <button type="button"
                            className="text-[10px] uppercase tracking-wider text-error hover:text-error/80 text-left transition-colors font-bold flex items-center gap-1"
                            onClick={() => setWaitlistForm({...waitlistForm, referenceImage: ''})}
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Eliminar
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-1">
                <label className="cursor-pointer flex items-center gap-2 text-on-surface-variant hover:text-emerald-accent transition-colors">
                  <span className="material-symbols-outlined text-xl">image</span>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider font-bold">Adjunta tu tatuaje de referencia</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setWaitlistForm({...waitlistForm, referenceImage: reader.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}/>
                </label>
              </div>
            )}

            <button type="button"
              className="w-full py-3 mt-2 bg-emerald-accent text-on-surface font-label-md font-extrabold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
              style={{backgroundColor: '#054d44', color: '#e5e2e1'}}
              onClick={async () => {
                const newMessage = {
                  id: Date.now(),
                  name: waitlistForm.name || waitlistForm.phone || 'Sin nombre',
                  time: new Date().toISOString(),
                  title: waitlistForm.type === 'consulta' ? 'Consulta general' : 'Idea de tatuaje',
                  text: waitlistForm.description || 'Sin descripción',
                  hasImage: !!waitlistForm.referenceImage,
                  referenceImage: waitlistForm.referenceImage || null,
                  referenceTitle: waitlistForm.referenceImage ? (allTattoos.find(t => t.src === waitlistForm.referenceImage)?.title || 'Imagen adjuntada') : null,
                  tags: [
                    waitlistForm.type === 'consulta' ? 'Consulta' : 'Idea',
                    ...(waitlistForm.referenceImage ? [allTattoos.find(t => t.src === waitlistForm.referenceImage) ? 'Refe. del portafolio' : 'Refe. del usuario'] : [])
                  ],
                  type: 'Nueva solicitud',
                  typeClass: 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-border-muted whitespace-nowrap rounded',
                  read: false
                };
                
                const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                await addDoc(collection(db, 'users', artistData.uid, 'waitlist'), {
                    ...newMessage,
                    createdAt: serverTimestamp()
                });
                
                trackMetric('agendaClicks');
                setWaitlistSuccess(true);
                setTimeout(() => {
                  setWaitlistModalOpen(false);
                  setWaitlistForm({ name: '', phone: '', type: 'consulta', description: '', referenceImage: '' });
                  setWaitlistSuccess(false);
                }, 2500);
              }}
            >
              Agendarme
            </button>
            </>
            )}
          </div>
        </div>
      )}
      {/* Terms Modal */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-2xl max-h-[80vh] flex flex-col p-6 relative overflow-hidden">
            <button type="button"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10"
              onClick={() => setTermsModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-4 shrink-0">Términos y Condiciones</h3>
            <div className="overflow-y-auto pr-2 flex-1 hide-scrollbar">
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                Bienvenido a Turnos Tattoo. Al utilizar nuestros servicios, usted acepta estos términos y condiciones en su totalidad. No utilice Turnos Tattoo si no acepta todos los términos y condiciones establecidos en esta página.
              </p>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                <strong>Reservas y Turnos:</strong> Todas las reservas están sujetas a disponibilidad y requieren confirmación por parte del artista. En algunos casos, puede ser necesario un depósito no reembolsable para asegurar la cita. Las cancelaciones deben realizarse con al menos 48 horas de anticipación para poder reprogramar sin penalización.
              </p>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                <strong>Diseños:</strong> Los diseños de los tatuajes son propiedad intelectual del artista. El artista se reserva el derecho de modificar el diseño para asegurar un mejor resultado en la piel, previa consulta con el cliente.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                <strong>Cuidado Posterior:</strong> Es responsabilidad exclusiva del cliente seguir las instrucciones de cuidado posterior proporcionadas por el artista. Turnos Tattoo y sus artistas no se hacen responsables de infecciones u otros problemas derivados de un cuidado inadecuado.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/10 shrink-0">
              <button type="button"
                className="w-full py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md uppercase font-bold transition-colors"
                onClick={() => setTermsModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-2xl max-h-[80vh] flex flex-col p-6 relative overflow-hidden">
            <button type="button"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10"
              onClick={() => setPrivacyModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-4 shrink-0">Política de Privacidad</h3>
            <div className="overflow-y-auto pr-2 flex-1 hide-scrollbar">
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                En Turnos Tattoo respetamos su privacidad y estamos comprometidos a proteger la información personal que nos proporciona. Esta política explica cómo recopilamos, usamos y salvaguardamos su información.
              </p>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                <strong>Información que Recopilamos:</strong> Podemos solicitar información personal como su nombre, número de teléfono, dirección de correo electrónico y detalles médicos relevantes cuando realiza una consulta, reserva un turno o interactúa con nuestros servicios.
              </p>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                <strong>Uso de la Información:</strong> Utilizamos su información para gestionar sus reservas, comunicarnos con usted acerca de su cita, proporcionarle información sobre nuestros servicios y garantizar que su experiencia de tatuaje sea segura y personalizada.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                <strong>Protección de Datos:</strong> Implementamos medidas de seguridad para mantener la confidencialidad de su información. No vendemos, intercambiamos ni transferimos a terceros su información personal identificable sin su consentimiento previo.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/10 shrink-0">
              <button type="button"
                className="w-full py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md uppercase font-bold transition-colors"
                onClick={() => setPrivacyModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-md p-6 relative flex flex-col gap-4 overflow-hidden">
            <button type="button"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10"
              onClick={() => {
                setContactModalOpen(false);
                setContactSuccess(false);
                setContactForm({ name: '', email: '', message: '' });
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-2">Contacto</h3>
            
            {contactSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
                </div>
                <h4 className="text-xl font-bold text-on-surface">¡Mensaje Enviado!</h4>
                <p className="text-on-surface-variant text-sm">Nos pondremos en contacto contigo a la brevedad.</p>
              </div>
            ) : (
              <>
                <p className="text-on-surface-variant text-sm mb-2">
                  Envíanos un mensaje a turnos.tatoo@gmail.com
                </p>
                <div className="flex flex-col gap-4 mt-2">
                  <p className="text-on-surface-variant text-sm mb-4">
                    Al hacer clic en el botón, se abrirá tu cliente de correo predeterminado para redactar un mensaje a nuestro equipo.
                  </p>
                  <a 
                    href="mailto:turnos.tatoo@gmail.com?subject=Consulta%20desde%20Turnos%20Tattoo"
                    className="w-full py-3 bg-primary text-on-primary font-label-md uppercase font-bold hover:bg-[#065f46] transition-colors text-center flex items-center justify-center gap-2"
                    onClick={() => setContactModalOpen(false)}
                  >
                    <span className="material-symbols-outlined">mail</span>
                    Abrir Correo
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
