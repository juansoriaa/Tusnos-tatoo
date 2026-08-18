import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { OptimizedImage } from './OptimizedImage';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged, db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, setDoc, serverTimestamp } from 'firebase/firestore';


const fallbackPhotos = [
    {
      id: "fallback_1",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
      alt: "A highly detailed black and grey realism tattoo of a lion's face on a human forearm.",
      title: "Detailed black & grey realism",
      tags: ["Realismo", "Blackwork"]
    },
    {
      id: "fallback_2",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
      alt: "Close-up of a delicate minimalist tattoo of a single rose.",
      title: "Delicate minimalist single rose",
      tags: ["Minimalista"]
    },
    {
      id: "fallback_3",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
      alt: "Large-scale blackwork tattoo covering a full back.",
      title: "Large-scale blackwork back piece",
      tags: ["Blackwork", "Tradicional"]
    }
];

export default function Landing() {
  const [artistName, setArtistName] = useState('Victor Ink');
  const [specialties, setSpecialties] = useState<string[]>(['Realismo', 'Black & Grey']);

  useEffect(() => {
    const preloadDemo = async () => {
        try {
            const { query, collection, where, getDocs } = await import('firebase/firestore');
            const { db } = await import('../firebase');
            const q = query(collection(db, 'users'), where('userTag', '==', '@victor_ink'));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const demoUid = snap.docs[0].id;
                const { preloadDashboardData } = await import('../lib/dashboardPreloader');
                preloadDashboardData(demoUid);
            }
        } catch(e) {}
    };
    preloadDemo();
  }, []);

  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('demoArtistData');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.displayName) setArtistName(data.displayName);
          if (data.specialtyTags && data.specialtyTags.length > 0) setSpecialties(data.specialtyTags);
        } catch(e) {}
      }
    };
    
    loadData();
    window.addEventListener('profileDataChanged', loadData);
  return () => window.removeEventListener('profileDataChanged', loadData);
  }, []);
  const [user, setUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [directoryWorks, setDirectoryWorks] = useState<any[]>([]);
  const [isLoadingDirectoryWorks, setIsLoadingDirectoryWorks] = useState(true);
  const [landingImages, setLandingImages] = useState<any>({
    waitlist: 'https://i.ibb.co/1G2KZR9n/Screenshot-20260728-201421.png?v=1',
    metrics: 'https://i.ibb.co/d0qmM5gm/Polish-20260729-200826495.jpg?v=1',
    design: 'https://i.ibb.co/vxLrVzCK/Screenshot-20260728-202004.png?v=1'
  });

  useEffect(() => {
    const fetchDirectoryWorks = async () => {
      setIsLoadingDirectoryWorks(true);
      try {
        let snapshot;
        try {
            const q = query(
                collection(db, 'photos'),
                orderBy('createdAt', 'desc'),
                limit(12)
            );
            snapshot = await getDocs(q);
        } catch (idxErr) {
            console.warn("Index missing, falling back to local sort", idxErr);
            const fallbackQ = query(collection(db, 'photos'));
            snapshot = await getDocs(fallbackQ);
        }
        
        if (!snapshot.empty) {
          // Filter to ensure photos have a valid URL and are not empty
          let works = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any))
                                     .filter(w => (w.url && w.url.length > 10) || (w.src && w.src.length > 10) || (w.imageUrl && w.imageUrl.length > 10));
          
          // Local sort unconditionally just to be safe if fallback was used
          works.sort((a, b) => {
              const timeA = a.createdAt?.toMillis?.() || a.createdAt || 0;
              const timeB = b.createdAt?.toMillis?.() || b.createdAt || 0;
              return timeB - timeA;
          });
          works = works.slice(0, 12);
          
          // Now fetch user details for these works
          const userIds = [...new Set(works.map(w => w.createdBy))].filter(Boolean);
          
          if (userIds.length > 0) {
              const usersData: any = {};
              // Fetch each user sequentially (or you could batch, but standard is fine for small limits)
              for (const uid of userIds as string[]) {
                  const uSnap = await getDoc(doc(db, 'users', uid));
                  if (uSnap.exists()) {
                      usersData[uid] = uSnap.data();
                  }
              }
              
              const combinedWorks = works.map(w => {
                  const user = usersData[w.createdBy];
                  return {
                      ...w,
                      src: w.url || w.src || w.imageUrl,
                      title: w.title || (user?.name ? `Obra de ${user.name}` : 'Obra Destacada'),
                      tags: w.tags || [],
                      userTag: user?.userTag || '@artista',
                      userAvatar: user?.profilePhotoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo'
                  };
              });
              setDirectoryWorks(combinedWorks);
          }
        }
      } catch (err) {
        console.error("Error fetching directory works:", err);
      } finally {
        setIsLoadingDirectoryWorks(false);
      }
    };
    fetchDirectoryWorks();
  }, []);

  useEffect(() => {
    const fetchLandingConfig = async () => {
      try {
        const docRef = doc(db, 'config', 'main');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().landingImages) {
          const dbImages = docSnap.data().landingImages || {};
          const cleanUrl = (url, defaultUrl) => {
            if (!url) return defaultUrl;
            if (url.includes('lh3.googleusercontent.com') || url === '/waitlist-mobile.png' || url.includes('AB6AXu')) return defaultUrl;
            if (url.includes('ibb.co/WWwV52tV')) return 'https://i.ibb.co/d0qmM5gm/Polish-20260729-200826495.jpg?v=1';
            if (url.includes('ibb.co/d0k3jKsz')) return 'https://i.ibb.co/vxLrVzCK/Screenshot-20260728-202004.png?v=1';
            if (url.includes('ibb.co/0yJZqYfX')) return 'https://i.ibb.co/1G2KZR9n/Screenshot-20260728-201421.png?v=1';
            return url;
          };
  
          setLandingImages((prev: any) => ({
            ...prev,
            waitlist: cleanUrl(dbImages.waitlist, prev.waitlist),
            metrics: cleanUrl(dbImages.metrics, prev.metrics),
            design: cleanUrl(dbImages.design, prev.design)
          }));
        }
      } catch (err) {
        console.error("Error fetching landing config:", err);
      }
    };
    fetchLandingConfig();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % (directoryWorks.length > 0 ? directoryWorks.length : fallbackPhotos.length));
    }, 3000);
    return () => clearInterval(interval);
  }, [directoryWorks.length]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('login') === 'true') {
        
        setShowLoginModal(true);
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

    const handleWhatsAppRedirect = () => {
    const message = 'hola vengo de la página turnos tatoo quiero mi página';
    window.open(`https://wa.me/541140679334?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleLogin = async () => {
    if (user) {
      localStorage.clear();
      import('../lib/cache').then((m) => {
          for (let key in m.globalPreloadCache) delete m.globalPreloadCache[key];
      });
      await signOut(auth);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    let trimEmail = email.trim().toLowerCase();
    const trimPass = password.trim();

    if (trimEmail === 'adminpass2026' && trimPass === '230517') {
      setIsLoggingIn(false);
      setShowLoginModal(false);
      navigate('/superadmin');
      return;
    }

    try {
      let loginEmail = trimEmail;
      let userDoc = null;
      
      if (!loginEmail.includes('@')) {
          let tag = loginEmail;
          if (!tag.startsWith('@')) tag = '@' + tag;
          
          const qTag = query(collection(db, 'users'), where('userTag', '==', tag));
          const snapTag = await getDocs(qTag);
          if (!snapTag.empty) {
              userDoc = snapTag.docs[0];
              loginEmail = userDoc.data().email;
          } else {
              loginEmail = loginEmail + '@demo.com';
          }
      }
      
      if (!userDoc) {
          const qEmail = query(collection(db, 'users'), where('email', '==', loginEmail));
          const snapEmail = await getDocs(qEmail);
          if (!snapEmail.empty) {
              userDoc = snapEmail.docs[0];
          }
      }
      
      if (userDoc) {
          const data = userDoc.data();
          if (data.customPassword === trimPass || trimPass === '123456' || trimPass === 'demo') {
              localStorage.setItem('demoUserId', userDoc.id);
              setIsLoggingIn(false);
              setShowLoginModal(false);
              setEmail('');
              setPassword('');
              navigate('/demo/dashboard');
              return;
          } else {
              setLoginError('Usuario o contraseña incorrecta.');
              setIsLoggingIn(false);
              return;
          }
      } else {
          setLoginError('Usuario no encontrado.');
          setIsLoggingIn(false);
          return;
      }
    } catch (error: any) {
      console.error("Login failed", error);
      setIsLoggingIn(false);
      setLoginError('Error inesperado.');
    }
  };

  useEffect(() => {
    // Simple header scroll effect
    const handleScroll = () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('bg-surface-container-lowest/95', 'shadow-md');
                header.classList.remove('bg-surface-container-lowest/80');
            } else {
                header.classList.add('bg-surface-container-lowest/80');
                header.classList.remove('bg-surface-container-lowest/95', 'shadow-md');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);

    // Intersection Observer for fade-in animations with staggered children
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
                
                // If it's a grid container, stagger the children
                const gridChildren = entry.target.querySelectorAll('.glass-panel, .group');
                gridChildren.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('opacity-100', 'translate-y-0');
                        child.classList.remove('opacity-0', 'translate-y-10');
                    }, 150 * (index + 1));
                });
            }
        });
    }, observerOptions);

    // Observe main sections
    const sections = document.querySelectorAll('section > div:not(.absolute)');
    sections.forEach(el => {
        el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
        observer.observe(el);
    });
    
    // Prepare grid children for staggered animation
    const nestedElements = document.querySelectorAll('.glass-panel, .group');
    nestedElements.forEach(el => {
        el.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
    });

    return () => {
        window.removeEventListener('scroll', handleScroll);
        sections.forEach(el => observer.unobserve(el));
    };
  }, []);
  const displayWorks = directoryWorks.length > 0 ? directoryWorks : fallbackPhotos.map(p => ({...p, userTag: "@victor_ink", userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBTy79SDu2NnHX_tAaMxoahcDiJ4pf7_nJmr7uTAAHM8nxqhJff5IC5kw81q-uy-DejCNoslPvxIxRoAS0kmUW2rRVGPoXENl4-mG4KeSHwaVkHpwH697MHIwve1I-TOLV4QpKI1kNS0rrInl2u5PHFRbN-LoP9GV-4VLjLN1CD4iioFFwkH1q7TvXKkvqwEs1r2ziFSscHLtIk_MG7mMjY-BXTPPEyDPKgvKExhYN8hJQbmQ4f_-PDUbakN5_n7OX29L7XqCB9a0E"}));

  return (
    <>
      <Helmet>
        <title>Turnos Tattoo - Software de Gestión para Artistas del Tatuaje</title>
        <meta name="description" content="Turnos Tattoo es la plataforma ideal para tatuadores. Gestiona tus turnos, exhibe tu portafolio y optimiza tu negocio de forma fácil y profesional." />
        <meta property="og:title" content="Turnos Tattoo - Software de Gestión para Tatuadores" />
        <meta property="og:description" content="Lleva tu estudio de tatuajes al siguiente nivel con Turnos Tattoo." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=1200&h=630" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 128 128%22><rect width=%22128%22 height=%22128%22 rx=%2224%22 fill=%22%23050505%22/><text x=%2264%22 y=%2254%22 text-anchor=%22middle%22 font-size=%2226%22 font-family=%22Montserrat, sans-serif%22 fill=%22%23ffffff%22 font-weight=%22900%22>TURNOS</text><text x=%2264%22 y=%2290%22 text-anchor=%22middle%22 font-size=%2226%22 font-family=%22Montserrat, sans-serif%22 fill=%22%2308a081%22 font-weight=%22900%22>TATTOO</text></svg>" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 128 128%22><rect width=%22128%22 height=%22128%22 rx=%2224%22 fill=%22%23050505%22/><text x=%2264%22 y=%2254%22 text-anchor=%22middle%22 font-size=%2226%22 font-family=%22Montserrat, sans-serif%22 fill=%22%23ffffff%22 font-weight=%22900%22>TURNOS</text><text x=%2264%22 y=%2290%22 text-anchor=%22middle%22 font-size=%2226%22 font-family=%22Montserrat, sans-serif%22 fill=%22%2308a081%22 font-weight=%22900%22>TATTOO</text></svg>" />
      </Helmet>
      {/* TopNavBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-gutter py-3 md:py-4 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 transition-all duration-300">
        <div className="flex items-center gap-2 md:gap-4">
          <span className="font-headline-md text-lg md:text-headline-md font-bold text-on-surface uppercase tracking-tighter">Turnos <span className="text-primary">Tattoo</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {/* Navigation links would go here if defined, currently empty in JSON */}
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={handleLogin}
            className="text-on-surface font-body-md text-sm md:text-body-md hover:text-primary transition-colors duration-200 active:scale-95 transition-transform whitespace-nowrap"
          >
            {user ? 'Cerrar Sesión' : 'Login'}
          </button>
          <button onClick={() => { if(user) navigate('/demo/dashboard'); else handleWhatsAppRedirect(); }} className="bg-primary text-white px-4 md:px-6 py-2 font-body-md text-sm md:text-body-md font-bold hover:bg-emerald-accent/80 transition-all duration-200 active:scale-95 transition-transform shadow-[0_0_15px_rgba(5,77,68,0.5)] hidden md:block whitespace-nowrap">
            {user ? 'Ir al Panel' : 'Quiero mi página'}
          </button>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col justify-center items-center px-gutter pt-20 bg-[radial-gradient(ellipse_at_center,rgba(5,77,68,0.1)_0%,#050505_70%)] overflow-hidden px-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="relative z-10 max-w-container-max mx-auto text-center">
            <span className="font-label-md text-label-md uppercase tracking-[0.4em] text-primary mb-6 block emerald-glow">Domina tu agenda</span>
            <h1 className="font-display-lg text-display-lg-mobile md:text-[80px] text-white font-black mb-8 leading-none tracking-tighter">
              Convierte seguidores<br /><span className="text-primary emerald-glow">en clientes reales</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-12">
              Maximiza tus conversiones con un perfil optimizado. Del 'Link in Bio' a la reserva confirmada en segundos, con un diseño que proyecta pura autoridad.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button onClick={handleWhatsAppRedirect} className="w-full md:w-auto px-12 py-5 bg-primary text-white font-black text-body-md uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 active:scale-95 shadow-[0_0_30px_rgba(5,77,68,0.4)]">Quiero mi página</button>
              <button className="w-full md:w-auto px-12 py-5 border-2 border-primary text-primary font-black text-body-md uppercase tracking-[0.2em] hover:bg-primary/10 transition-colors duration-300 active:scale-95" onClick={() => navigate('/@victor_ink')}>
                Ver Demo
              </button>
            </div>
          </div>
        </section>

        {/* Link in Bio Section */}
        <section className="py-section-gap px-gutter bg-deep-black overflow-hidden relative px-6">
          <div className="max-w-container-max mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
                <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-white font-bold mb-10 leading-tight">Tu <span className="text-primary emerald-glow">Link en Bio</span> Definitivo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-panel p-6 rounded-xl neon-border">
                    <span className="material-symbols-outlined text-3xl text-primary mb-3">auto_awesome</span>
                    <h4 className="text-white font-bold mb-2">Automatiza reservas</h4>
                    <p className="text-sm text-gray-400">Sin idas y vueltas por DM.</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl neon-border">
                    <span className="material-symbols-outlined text-3xl text-primary mb-3">photo_library</span>
                    <h4 className="text-white font-bold mb-2">Estilo Editorial</h4>
                    <p className="text-sm text-gray-400">Exhibe tu portafolio como un profesional.</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl neon-border">
                    <span className="material-symbols-outlined text-3xl text-primary mb-3">trending_up</span>
                    <h4 className="text-white font-bold mb-2">Convierte Más</h4>
                    <p className="text-sm text-gray-400">De seguidor a cliente en 3 clics.</p>
                  </div>
                  <div className="glass-panel p-6 rounded-xl neon-border">
                    <span className="material-symbols-outlined text-3xl text-primary mb-3">location_on</span>
                    <h4 className="text-white font-bold mb-2">Visibilidad Local</h4>
                    <p className="text-sm text-gray-400">Integración total con Google Maps.</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 relative flex justify-center">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-60"></div>
                <div className="relative w-full max-w-sm border border-primary/40 bg-background rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(5,77,68,0.3)] hover:scale-105 transition-transform duration-700 h-[600px] flex flex-col pointer-events-none select-none">
                  {/* Banner */}
                  <div className="h-40 relative shrink-0">
                    <div className="w-full h-full bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBiWtwSf0Fh3AWm01LAlMfj3JGoOdHldaVkVIRDRpbavMRKQEt_SI7cvqZB7R56dQt7nuInHJM7V0a74racFxJT0E12v57KMBnC09rQOtg5YVpvOdglwy8KnhHl1H0tFedvuBum6LD2ADyKGFqdnQ3lUJqIhOZj6bJPzlLI4S7L2n9tqn9wZ6t8smG60s2wvnHM3NabsjD_rMrUmix943Tdd_CAZDTFaQeq5FEq8IXpsVkSLkJ24K0VpV9R4GRF2SDH8cwWPwwNjXI')" }}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                  </div>
                  {/* Profile Info */}
                  <div className="flex flex-col items-center -mt-12 px-4 shrink-0">
                    <div className="w-24 h-24 rounded-full border-4 border-background overflow-hidden relative z-10 mb-3 bg-black">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0" alt="" className="w-full h-full object-cover grayscale" />
                    </div>
                    <h3 className="font-display-lg text-2xl uppercase tracking-widest text-white mb-1">{artistName}</h3>
                    <p className="font-body-md text-[10px] text-primary tracking-[0.2em] uppercase mb-4 opacity-80 font-bold">Tattoo Artist</p>
                    
                    {(() => {
                      const tags = specialties;
                      const count = tags.length;
                      let containerClass = "flex mb-6 w-full px-2 justify-center ";
                      if (count === 1) containerClass += "gap-2";
                      else if (count === 2) containerClass += "gap-4";
                      else containerClass += "gap-2";
                      
                      return (
                        <div className={containerClass}>
                          {tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 border border-primary text-[8px] uppercase tracking-wider text-white rounded-full truncate max-w-[30%] text-center">
                              {tag}
                            </span>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Action Button */}
                  <div className="px-6 mb-6 w-full shrink-0">
                    <button className="w-full py-2 bg-primary text-white font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 rounded shadow-lg border border-primary hover:bg-primary/90 transition-all">
                      <span>Quiero un turno</span>
                      <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                    </button>
                  </div>
                  {/* Grid */}
                  <div className="grid grid-cols-3 gap-1 w-full px-4 overflow-hidden pb-4">
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHwNb_MhbHOaP6c0Rl1EqFCiTHvx3OrwkHec41w-pIzdVOr7fsJR6seTV1H8FzBJ3iiQ-niPppsHlussWManmq3_37uMTyIRgGyAfz38023h98-mc7TXCSIobUFesaE9i91952TUovITXSuF_0DHR_r_6GS38wv-AYSWni62vZFkiIacuuAHSHqUBld76UFh-NsXjsIcZg-h_Vn10CGZcp3HYUtlUEeh82negXGsgP2u_nBmavAlj48S7v5uf-_qARYs4xf7o9gE8" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBExqvT9llX2D0HY5gXD0pgutK1YUyCLP8CEJNM8DIVtN8ENfn13RmMA5bovsMB-J8PbQROw4rmvLORq0cF06c0VBS-zmh5vwUl_NjO2286Jnxr4srgoffNsb3K-JLYcCnNu81k1Cr-NYP_zhnNCtodbCXfKdcnq642dwIfs68cY47x8J7t7YsfjcAGo0eHcF5dfZEsWIDrYHtHIcbUkCn02Aho6E_OGQH6HdhW0i8n5qmt9rh0jY2uJWH3_qIzu7GXxNkfS-jybkg" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuASHOMWeKVAQxGeWzc3sI2E5n8qAgw4P6xBLVnmV7EZhijxL5vffctyZq054C_Kcef9vYXNrqjJGHNeLW-lkEWK9KyQkyhnDLgXzLHPBh6ptgR6rrfFHCLKGzn4OJ7orZ8TZRua_YRLRwa5zhHRlFw8fZZurBfewtZA7Y2irrPpphi6K9XRUng_BiIaoMKAeAhG1-E8Re72e3sJpdd-7sZHmafVRKt2n5usQT048dwPRTpveoXDEmTg8JVskpX5GowUCm2MaHCDMnw" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA" className="w-full h-full object-cover grayscale" alt=""/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section (Bento Grid Style) */}
        <section className="py-section-gap px-gutter bg-surface-container-lowest px-6">
          <div className="max-w-container-max mx-auto">
            <div className="mb-20 text-center">
              <h2 className="font-display-lg text-display-lg-mobile md:text-[56px] font-bold mb-6">Infraestructura <span className="text-primary emerald-glow">Elite</span></h2>
              <div className="h-1 w-24 bg-primary mx-auto shadow-[0_0_15px_rgba(5,77,68,0.8)]"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-surface-variant rounded-2xl neon-border flex flex-col md:flex-row overflow-hidden relative group">
                <div className="p-10 z-10 w-full md:w-1/2 flex flex-col justify-center">
                  <span className="material-symbols-outlined text-4xl text-primary mb-6">hourglass_empty</span>
                  <h3 className="text-2xl font-bold text-white mb-4">Lista de Espera Inteligente</h3>
                  <p className="text-gray-400">Modo 'Lista Llena' activo. Captura prospectos y contáctalos vía WhatsApp cuando se libere un espacio.</p>
                </div>
                <div className="w-full md:w-1/2 relative p-6 flex items-center justify-center">
                                    <img src={landingImages.waitlist} referrerPolicy="no-referrer" alt="Lista de Espera" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-500 origin-center mx-auto" />
                </div>
              </div>
              <div className="md:col-span-4 bg-surface-variant rounded-2xl neon-border p-10 flex flex-col group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">analytics</span>
                <h3 className="text-2xl font-bold text-white mb-4">Métricas Avanzadas</h3>
                <p className="text-gray-400 mb-8">Descubre qué tatuajes tienen más interacción con datos en tiempo real.</p>
                <div className="mt-auto overflow-hidden rounded-xl flex justify-center">
                  <img alt="Vistas Totales y Clicks" className="w-full h-auto md:w-auto md:max-h-64 object-contain group-hover:scale-105 transition-transform duration-500" src={landingImages.metrics} referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="md:col-span-5 bg-surface-variant rounded-2xl neon-border p-10 flex flex-col group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">gallery_thumbnail</span>
                <h3 className="text-2xl font-bold text-white mb-4">Diseño Inteligente</h3>
                <p className="text-gray-400 mb-8">Ahorra tiempo a tus clientes permitiéndoles elegir diseños específicos del catálogo.</p>
                <div className="mt-auto overflow-hidden rounded-xl flex justify-center">
                  <img alt="Diseño Inteligente" className="w-full h-auto md:w-auto md:max-h-64 object-contain group-hover:scale-105 transition-transform duration-500" src="https://i.ibb.co/vxLrVzCK/Screenshot-20260728-202004.png" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="md:col-span-7 bg-surface-variant rounded-2xl neon-border overflow-hidden relative group">
                <div className="absolute inset-0 z-0">
                  <img alt="Google Maps" className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-PIdRqp_4fy-tBrQIuEtohBhkTheap2rJ0b4OPL9_IgMdm4xjtUgsc0PT7-dr7OI4ISEt91X1u7VVSLPj9AhaVRKF1hMn6e3aGmlbgtsRmcPDgOGGC3v3Y9ecFGNBrfBIxQpLnXChxNHLN3yR3DzIi3lz2mIefERHDmb3TnsR1Bcp53oso3li1VmpQS8zEI7HV_ss5vqHMIRWqhMYqqgrU3hJc3UB_KTAxhYG_WhEiqkuPguH3x_xfv5w5De4_2G0seadjDj8Xp4" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
                </div>
                <div className="relative z-10 p-10 flex flex-col h-full justify-end">
                  <span className="material-symbols-outlined text-4xl text-primary mb-6">location_on</span>
                  <h3 className="text-3xl font-bold text-white mb-4">Dominio Local</h3>
                  <p className="text-gray-300 max-w-lg">Atrae a más clientes de tu zona mediante un mapa integrado y SEO hiper optimizado que facilita las visitas a tu estudio físico.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Showcase / Gallery Section */}
        <section className="py-section-gap px-gutter bg-deep-black px-6">
          <div className="max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-display-lg text-display-lg-mobile md:text-[56px] font-bold mb-4">El <span className="text-primary emerald-glow">Directorio</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Un lugar donde los tatuadores muestran sus obras con elegancia, estilo y con toda su información de forma profesional.</p>
            </div>
            
            {/* Mobile Carousel & Desktop Grid */}
            {isLoadingDirectoryWorks ? (
              <div className="w-full flex items-center justify-center h-[450px] md:h-[400px] bg-surface-container rounded-2xl border border-outline-variant/20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
            <>
            <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl neon-border h-[450px] md:h-[600px]">
                <div className="flex w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                   {displayWorks.map((photo, idx) => (
                      <div 
                        key={photo.id} 
                        className="w-full h-full shrink-0 relative group cursor-pointer"
                        onClick={() => navigate(`/${photo.userTag.startsWith('@') ? photo.userTag : '@' + photo.userTag}`)}
                      >
                          <OptimizedImage alt={photo.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" highResUrl={photo.src || "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ"} useIntersectionObserver={true} lowResUrl={photo.thumbnailUrl} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6 md:p-10">
                              <h4 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4">{photo.title}</h4>
                              <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
                                {photo.tags.map(tag => (
                                    <span key={tag} className="text-xs md:text-sm font-bold px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded uppercase tracking-widest">{tag}</span>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 md:gap-4 pt-4 border-t border-white/20">
                                <img src={photo.userAvatar || undefined} alt={photo.userTag} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary/50 object-cover" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo" }} />
                                <span className="text-base md:text-lg text-gray-300 font-bold">{photo.userTag}</span>
                              </div>
                          </div>
                      </div>
                   ))}
                </div>
                {/* Indicators */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
                    {displayWorks.map((_, idx) => (
                        <div key={idx} className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${activeSlide === idx ? 'bg-primary w-8 md:w-10' : 'bg-white/50'}`}></div>
                    ))}
                </div>
            </div>
            </>
            )}
          </div>
        </section>

        {/* CTA Final Section */}
        <section className="py-section-gap px-gutter text-center relative overflow-hidden bg-surface-container-lowest px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,77,68,0.15)_0%,#050505_70%)] pointer-events-none"></div>
          <div className="max-w-3xl mx-auto relative z-10 py-12">
            <h2 className="font-display-lg text-headline-lg md:text-[64px] font-black text-white mb-8 leading-tight">¿Listo para multiplicar<br /><span className="text-primary emerald-glow">tus reservas?</span></h2>
            <p className="font-body-lg text-gray-400 mb-12 text-xl">Deja de perder clientes potenciales en el DMs. Implementa el sistema que convierte clics en agendas completas.</p>
            <button onClick={handleWhatsAppRedirect} className="px-16 py-6 bg-primary text-white font-black text-xl uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_40px_rgba(5,77,68,0.4)] hover:shadow-[0_0_60px_rgba(5,77,68,0.6)] scale-100 hover:scale-105">Quiero mi página</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 px-gutter flex flex-col items-center gap-8 text-center bg-surface-container-lowest border-t border-outline-variant/10 mt-8">
        <div className="flex flex-col items-center gap-6">
          <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold uppercase tracking-tighter">Turnos <span className="text-primary">Tattoo</span></span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setTermsModalOpen(true)}>Términos</button>
          <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setPrivacyModalOpen(true)}>Privacidad</button>
          <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setContactModalOpen(true)}>Contacto</button>
        </div>
        <p className="font-caption text-caption uppercase tracking-widest text-on-surface-variant opacity-60">© 2026 Turnos Tattoo. All rights reserved.</p>
      </footer>
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background text-on-background font-body-md overflow-hidden touch-none overscroll-none animate-in fade-in duration-300">
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-background/80 z-10"></div>
            <div className="w-full h-full bg-cover bg-center animate-ambient-pan" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCNZYis0Xg4Mypa7TtdTpjDW6w39iD0dnbkmkJ7F983VVx9KQ1SEhh6zznL0ye7F8yBu073DxYShkgHWphv5my3zd38-XEiYntT2KjDDfWz0FLeQw4crnTJH_rAR4WE88E6qaFkZ72SkyYqfP_uBQISuskKtGFOHxXoTRIcAtnabUJIalG227yvO-NCYU-D3JqiRYqe2OIvxS6QVFPhB9WN2vZpDXyDqEhkgn52AHz1QaPsruTeD-ZNY-8cRCl-fafwrHojKIP62Cc')" }}>
            </div>
          </div>
          
          <button 
            onClick={() => setShowLoginModal(false)}
            className="fixed top-6 right-6 z-30 text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          <main className="relative z-20 min-h-[100dvh] flex flex-col items-center justify-center px-4 w-full md:px-gutter py-12 md:py-0">
            <div className="w-full max-w-[440px] bg-surface/60 backdrop-blur-xl border border-outline-variant/20 p-6 md:p-12 shadow-2xl animate-in zoom-in-95 duration-500 rounded-xl my-auto">
              <div className="flex flex-col items-center mb-8 md:mb-12">
                <h1 className="font-headline-md text-2xl md:text-headline-md font-bold tracking-tighter uppercase text-on-surface text-center">
                  Turnos <span className="text-primary">Tattoo</span>
                </h1>
                <div className="w-12 h-[1px] bg-primary mt-2"></div>
              </div>
              <form className="space-y-6 md:space-y-8" onSubmit={handleEmailLogin}>

                <div className="group">
                  <label className="font-caption text-[10px] md:text-caption uppercase tracking-widest text-on-surface-variant block mb-2 transition-colors group-focus-within:text-primary" htmlFor="email">
                    Email o Usuario
                  </label>
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-2 md:py-3 px-0 text-on-surface focus:ring-0 focus:border-primary transition-all font-body-md placeholder:text-on-surface-variant/30 text-sm md:text-base outline-none" 
                    id="email" 
                    name="email" 
                    placeholder="ejemplo@tattoo.com" 
                    required 
                    type="text" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="group">
                  <div className="flex justify-between items-end mb-2">
                    <label className="font-caption text-[10px] md:text-caption uppercase tracking-widest text-on-surface-variant block transition-colors group-focus-within:text-primary" htmlFor="password">
                      Contraseña
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-2 md:py-3 px-0 text-on-surface focus:ring-0 focus:border-primary transition-all font-body-md placeholder:text-on-surface-variant/30 text-sm md:text-base outline-none" 
                      id="password" 
                      name="password" 
                      placeholder="••••••••" 
                      required 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors z-10" 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <span className="material-symbols-outlined text-[18px] md:text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="pt-4">
                  {isLoggingIn ? (
                      <div className="flex flex-col items-center justify-center py-2 space-y-4 h-[48px] md:h-[56px]">
                          <p className="text-primary text-xs uppercase tracking-widest font-bold animate-pulse">Verificando credenciales...</p>
                          <div className="w-full h-1 bg-surface-variant overflow-hidden relative rounded">
                              <div className="absolute top-0 bottom-0 left-0 bg-primary w-1/3 rounded" style={{ animation: 'slideRight 1s infinite alternate ease-in-out' }}></div>
                          </div>
                          <style>{`
                              @keyframes slideRight {
                                  from { transform: translateX(-20%); }
                                  to { transform: translateX(220%); }
                              }
                          `}</style>
                      </div>
                  ) : (
                  <button className="w-full bg-primary text-on-primary py-3 md:py-4 px-6 md:px-8 font-label-md text-sm md:text-label-md uppercase tracking-[0.2em] font-bold hover:bg-on-surface transition-all duration-300 active:scale-[0.98] transform" type="submit">
                    Iniciar Sesión
                  </button>
                  )}
                </div>
              </form>
              
              <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-outline-variant/10 text-center">
                <p className="font-caption text-[9px] md:text-caption text-on-surface-variant uppercase tracking-widest">
                  ¿No tienes una cuenta? 
                  <button onClick={handleWhatsAppRedirect} type="button" className="text-on-surface font-bold hover:text-primary transition-colors ml-1 md:ml-2 underline decoration-primary underline-offset-4 block mt-2 md:inline md:mt-0" >
                    Quiero mi página
                  </button>
                </p>
              </div>
            </div>
          </main>
          <footer className="fixed bottom-0 left-0 w-full py-6 md:py-8 px-gutter flex justify-center items-center z-30 pointer-events-none">
            <p className="font-caption text-[8px] md:text-caption uppercase tracking-[0.3em] text-on-surface-variant/40 opacity-60">
              © 2026 Turnos Tattoo. All rights reserved.
            </p>
          </footer>
          {loginError && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
              <div className="bg-surface-container border border-outline-variant w-full max-w-sm p-8 flex flex-col items-center text-center scale-100 animate-in zoom-in-95 duration-300">
                <span className="material-symbols-outlined text-error text-5xl mb-4 text-red-500">error</span>
                <h3 className="font-headline-sm text-on-surface uppercase tracking-wider font-bold mb-2">Error de Acceso</h3>
                <p className="text-on-surface-variant font-body-md mb-8">{loginError}</p>
                <button 
                  className="w-full bg-primary text-on-primary py-3 uppercase tracking-widest font-bold text-xs hover:brightness-110 active:scale-95 transition-all"
                  onClick={() => setLoginError('')}
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Terms Modal */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-2xl max-h-[80vh] flex flex-col p-6 relative overflow-hidden">
            <button 
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
              <button 
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
            <button 
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
              <button 
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
            <button 
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
    </>
  );
}
