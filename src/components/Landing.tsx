import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';


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
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % fallbackPhotos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('login') === 'true') {
        setIsRegister(false);
        setShowLoginModal(true);
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
      const { collection, query, where, getDocs, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      
      if (isRegister) {
          if (!trimEmail.includes('@')) {
              trimEmail = trimEmail + '@demo.com';
          }
          
          const qEmail = query(collection(db, 'users'), where('email', '==', trimEmail));
          const snapEmail = await getDocs(qEmail);
          
          if (!snapEmail.empty) {
              setLoginError('El correo o usuario ya está en uso.');
              setIsLoggingIn(false);
              return;
          }
          
          const userUid = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
          let baseName = trimEmail.split('@')[0];
          
          await setDoc(doc(db, 'users', userUid), {
              uid: userUid,
              email: trimEmail,
              userTag: '@' + baseName,
              displayName: baseName,
              specialtyTags: ['Tatuador'],
              createdAt: serverTimestamp(),
              bio: 'Bienvenido a mi portafolio.',
              location: 'Mi Estudio',
              experience: 'Nuevo',
              customPassword: trimPass
          });
          
          localStorage.setItem('demoUserId', userUid);
          
          setIsLoggingIn(false);
          setShowLoginModal(false);
          setEmail('');
          setPassword('');
          navigate('/demo/dashboard');
          return;
      } else {
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
                  setLoginError('Credenciales incorrectas.');
                  setIsLoggingIn(false);
                  return;
              }
          } else {
              if (loginEmail.endsWith('@demo.com') && (trimPass === '123456' || trimPass === 'demo')) {
                  const userUid = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
                  let baseName = loginEmail.split('@')[0];
                  
                  await setDoc(doc(db, 'users', userUid), {
                      uid: userUid,
                      email: loginEmail,
                      userTag: '@' + baseName,
                      displayName: baseName,
                      specialtyTags: ['Tatuador', 'Fine Line', 'Geométrico'],
                      customPassword: trimPass,
                      createdAt: serverTimestamp(),
                      bio: 'Bienvenido a mi portafolio.',
                      location: 'Mi Estudio',
                      experience: 'Nuevo'
                  });
                  localStorage.setItem('demoUserId', userUid);
                  
                  setIsLoggingIn(false);
                  setShowLoginModal(false);
                  setEmail('');
                  setPassword('');
                  navigate('/demo/dashboard');
                  return;
              } else {
                  setLoginError('Usuario no encontrado.');
                  setIsLoggingIn(false);
                  return;
              }
          }
      }
    } catch (error: any) {
      console.error("Login failed", error);
      setIsLoggingIn(false);
      setLoginError(isRegister ? 'Error al registrarse.' : 'Error inesperado.');
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
    const sections = document.querySelectorAll('section > div');
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

  return (
    <>
      <Helmet>
        <title>Turnos Tattoo - Software de Gestión para Artistas del Tatuaje</title>
        <meta name="description" content="Turnos Tattoo es la plataforma ideal para tatuadores. Gestiona tus turnos, exhibe tu portafolio y optimiza tu negocio de forma fácil y profesional." />
        <meta property="og:title" content="Turnos Tattoo - Software de Gestión para Tatuadores" />
        <meta property="og:description" content="Lleva tu estudio de tatuajes al siguiente nivel con Turnos Tattoo." />
        <meta name="twitter:card" content="summary_large_image" />
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
          <button onClick={() => { if(user) navigate('/demo/dashboard'); else { setIsRegister(true); setShowLoginModal(true); } }} className="bg-primary text-white px-4 md:px-6 py-2 font-body-md text-sm md:text-body-md font-bold hover:bg-emerald-accent/80 transition-all duration-200 active:scale-95 transition-transform shadow-[0_0_15px_rgba(5,77,68,0.5)] hidden md:block whitespace-nowrap">
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
              <button onClick={() => { setIsRegister(true); setShowLoginModal(true); }} className="w-full md:w-auto px-12 py-5 bg-primary text-white font-black text-body-md uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 active:scale-95 shadow-[0_0_30px_rgba(5,77,68,0.4)]">Quiero mi página</button>
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

                  {/* Grid */}
                  <div className="grid grid-cols-3 gap-1 w-full px-4 overflow-hidden">
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHwNb_MhbHOaP6c0Rl1EqFCiTHvx3OrwkHec41w-pIzdVOr7fsJR6seTV1H8FzBJ3iiQ-niPppsHlussWManmq3_37uMTyIRgGyAfz38023h98-mc7TXCSIobUFesaE9i91952TUovITXSuF_0DHR_r_6GS38wv-AYSWni62vZFkiIacuuAHSHqUBld76UFh-NsXjsIcZg-h_Vn10CGZcp3HYUtlUEeh82negXGsgP2u_nBmavAlj48S7v5uf-_qARYs4xf7o9gE8" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBExqvT9llX2D0HY5gXD0pgutK1YUyCLP8CEJNM8DIVtN8ENfn13RmMA5bovsMB-J8PbQROw4rmvLORq0cF06c0VBS-zmh5vwUl_NjO2286Jnxr4srgoffNsb3K-JLYcCnNu81k1Cr-NYP_zhnNCtodbCXfKdcnq642dwIfs68cY47x8J7t7YsfjcAGo0eHcF5dfZEsWIDrYHtHIcbUkCn02Aho6E_OGQH6HdhW0i8n5qmt9rh0jY2uJWH3_qIzu7GXxNkfS-jybkg" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuASHOMWeKVAQxGeWzc3sI2E5n8qAgw4P6xBLVnmV7EZhijxL5vffctyZq054C_Kcef9vYXNrqjJGHNeLW-lkEWK9KyQkyhnDLgXzLHPBh6ptgR6rrfFHCLKGzn4OJ7orZ8TZRua_YRLRwa5zhHRlFw8fZZurBfewtZA7Y2irrPpphi6K9XRUng_BiIaoMKAeAhG1-E8Re72e3sJpdd-7sZHmafVRKt2n5usQT048dwPRTpveoXDEmTg8JVskpX5GowUCm2MaHCDMnw" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" className="w-full h-full object-cover grayscale" alt=""/></div>
                    <div className="aspect-square bg-surface-container"><img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHwNb_MhbHOaP6c0Rl1EqFCiTHvx3OrwkHec41w-pIzdVOr7fsJR6seTV1H8FzBJ3iiQ-niPppsHlussWManmq3_37uMTyIRgGyAfz38023h98-mc7TXCSIobUFesaE9i91952TUovITXSuF_0DHR_r_6GS38wv-AYSWni62vZFkiIacuuAHSHqUBld76UFh-NsXjsIcZg-h_Vn10CGZcp3HYUtlUEeh82negXGsgP2u_nBmavAlj48S7v5uf-_qARYs4xf7o9gE8" className="w-full h-full object-cover grayscale" alt=""/></div>
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
                <div className="w-full md:w-1/2 relative bg-surface-elevation p-6 flex items-center justify-center">
                                    <div className="w-full max-w-[280px] bg-black rounded-[2rem] border-[6px] border-surface-variant shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative group-hover:scale-105 transition-transform duration-500 origin-center mx-auto" style={{ aspectRatio: '9/19' }}>
                    {/* Status Bar */}
                    <div className="h-7 w-full flex justify-between items-center px-5 pt-2 shrink-0 bg-transparent z-10 relative">
                      <span className="text-[10px] font-medium text-white tracking-wider">9:41</span>
                      <div className="flex gap-1.5 items-center">
                        <span className="material-symbols-outlined text-[12px] text-white">signal_cellular_4_bar</span>
                        <span className="material-symbols-outlined text-[12px] text-white">wifi</span>
                        <span className="material-symbols-outlined text-[12px] text-white">battery_full</span>
                      </div>
                    </div>
                    {/* Header */}
                    <div className="px-5 pb-3 pt-4 flex justify-between items-center shrink-0 z-10 relative">
                        <h4 className="text-base font-bold text-white">Lista de Espera</h4>
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">filter_list</span>
                    </div>
                    {/* Messages Container (Styled like DemoWaitlist) */}
                    <div className="flex-1 overflow-hidden px-4 flex flex-col gap-3 z-10 relative">
                        {/* New Message */}
                        <article className="p-3 border-l-2 bg-[#054d44]/10 border-emerald-accent shadow-[0_0_15px_rgba(5,77,68,0.3)]">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-white text-[11px]">Alex M.</span>
                                    <span className="px-1 py-[2px] bg-[#03120f] text-emerald-accent border border-emerald-accent/50 text-[7px] font-bold uppercase tracking-wider rounded">Consulta</span>
                                    <span className="relative flex h-2 w-2 ml-0.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-accent opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-accent shadow-[0_0_8px_rgba(149,210,198,0.9)]"></span>
                                    </span>
                                </div>
                                <span className="text-[9px] text-on-surface-variant whitespace-nowrap">10:23</span>
                            </div>
                            <h4 className="text-[11px] font-bold text-silver-text mb-1">Consulta de Cover-up</h4>
                            <p className="text-[10px] text-on-surface-variant mb-3 line-clamp-2 leading-snug">Tengo un tatuaje antiguo en mi antebrazo que quiero cubrir con algo botánico. Específicamente buscando...</p>
                            <div className="flex gap-2 mt-auto">
                                <button className="flex-1 py-1.5 flex items-center justify-center gap-1.5 text-white text-[8px] font-bold uppercase tracking-widest rounded-sm" style={{backgroundColor: '#0b5047', border: '1px solid #0b5047'}}>
                                    <span className="material-symbols-outlined text-[11px]">visibility</span> Obra
                                </button>
                                <button className="flex-1 py-1.5 flex items-center justify-center gap-1.5 text-white text-[8px] font-bold uppercase tracking-widest rounded-sm" style={{backgroundColor: '#0b5047', border: '1px solid #0b5047'}}>
                                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path></svg> Responder
                                </button>
                            </div>
                        </article>
                        
                        {/* Message 3 */}
                        <article className="p-3 border-l-2 bg-surface-container-high border-outline-variant/30">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-white text-[11px]">Martin T.</span>
                                </div>
                                <span className="text-[9px] text-on-surface-variant whitespace-nowrap">Ayer</span>
                            </div>
                            <h4 className="text-[11px] font-bold text-silver-text mb-1">Idea de tatuaje botánico</h4>
                            <p className="text-[10px] text-on-surface-variant mb-3 line-clamp-2 leading-snug">Hola, estuve viendo tu portafolio y me encantó. Quería saber si haces diseños de helechos en blackwork, me gustaría agendar...</p>
                        </article>
                        
                        {/* Message 4 */}
                        <article className="p-3 border-l-2 bg-surface-container-high border-outline-variant/30">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-white text-[11px]">Laura G.</span>
                                    <span className="px-1 py-[2px] bg-[#03120f] text-emerald-accent border border-emerald-accent/50 text-[7px] font-bold uppercase tracking-wider rounded">Refe. Portafolio</span>
                                </div>
                                <span className="text-[9px] text-on-surface-variant whitespace-nowrap">Lun.</span>
                            </div>
                            <h4 className="text-[11px] font-bold text-silver-text mb-1">Disponibilidad para este diseño</h4>
                            <p className="text-[10px] text-on-surface-variant mb-3 line-clamp-2 leading-snug">Me encantó la flor de loto que subiste la semana pasada, ¿cuánto tiempo llevaría hacer algo similar en la espalda?</p>
                        </article>
                        
                                                {/* Old Message */}
                        <article className="p-3 border-l-2 bg-surface-container-high border-outline-variant/30">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-white text-[11px]">Sarah L.</span>
                                </div>
                                <span className="text-[9px] text-on-surface-variant whitespace-nowrap">Ayer</span>
                            </div>
                            <h4 className="text-[11px] font-bold text-silver-text mb-1">Confirmación de turno para el viernes</h4>
                            <p className="text-[10px] text-on-surface-variant mb-3 line-clamp-2 leading-snug">Solo para confirmar nuestra cita para el viernes a las 2PM para la pieza tradicional. ¿Necesito hacer...</p>
                            <div className="flex gap-2 mt-auto">
                                <button className="flex-1 py-1.5 flex items-center justify-center gap-1.5 text-white text-[8px] font-bold uppercase tracking-widest rounded-sm" style={{backgroundColor: '#0b5047', border: '1px solid #0b5047'}}>
                                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"></path></svg> Responder
                                </button>
                            </div>
                        </article>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 bg-surface-variant rounded-2xl neon-border p-10 flex flex-col group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">analytics</span>
                <h3 className="text-2xl font-bold text-white mb-4">Métricas Avanzadas</h3>
                <p className="text-gray-400 mb-8">Descubre qué tatuajes tienen más interacción con datos en tiempo real.</p>
                <div className="mt-auto overflow-hidden rounded-xl">
                  <img alt="Vistas Totales y Clicks" className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAA4BVdUbKryLe6JGKvjji5DWM5QwUCLuyT7Rozf7K63R_EQrG1a0pUqjRFZBwtA0GjQIqjRhallrMYgEZc5XkxqYnbRY6XyMki7t-62lX9Bb9Sa3s7HwcbuYAG4VmpkjGAF7TMYg8iwo1Q2WEKxPHdJJIBmMgpZXV3lvkRdYNF_I9a4t-Qovf4Q6G9Ahyg3lKWRUh4cVur34l-0e4rvOxlNThSxhYiSEoMEkyB1iZ_4Zh-wVcSTydWWBex_Erpg5RfitXyzDoEUw4" />
                </div>
              </div>
              <div className="md:col-span-5 bg-surface-variant rounded-2xl neon-border p-10 flex flex-col group">
                <span className="material-symbols-outlined text-4xl text-primary mb-6">gallery_thumbnail</span>
                <h3 className="text-2xl font-bold text-white mb-4">Diseño Inteligente</h3>
                <p className="text-gray-400 mb-8">Ahorra tiempo a tus clientes permitiéndoles elegir diseños específicos del catálogo.</p>
                <div className="mt-auto relative rounded-xl overflow-hidden aspect-square bg-surface-container border border-outline-variant/20 shadow-2xl flex flex-col pointer-events-none group-hover:scale-105 transition-transform duration-500 select-none">
                  {/* Pseudo Modal */}
                  <div className="absolute top-2 right-2 z-20 p-1 text-on-surface bg-surface/50 backdrop-blur-sm rounded-full">
                    <span className="material-symbols-outlined text-xs">close</span>
                  </div>
                  
                  {/* Image section */}
                  <div className="w-full h-1/2 bg-black flex flex-col items-center justify-center p-2 relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 z-0 flex items-center justify-center opacity-25 blur-xl scale-110 pointer-events-none">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" className="w-full h-full object-cover opacity-50" alt="" />
                    </div>
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" className="max-w-full max-h-full object-contain relative z-10 shadow-2xl" alt="" />
                  </div>
                  
                  {/* Details section */}
                  <div className="w-full h-1/2 p-3 sm:p-4 flex flex-col border-t border-outline-variant/10 bg-surface-container overflow-hidden">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5 justify-center">
                       <span className="px-1.5 py-0.5 border border-primary text-[6px] font-bold tracking-widest text-primary uppercase bg-primary/5">Realismo</span>
                    </div>
                    <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-tight text-on-surface mb-1 text-center">Retrato Surrealista</h2>
                    
                    <div className="flex justify-between w-full border-t border-outline-variant/10 pt-2 mt-auto mb-2">
                      <div className="flex flex-col items-center justify-center text-center py-1 px-1 border border-outline-variant/10 bg-surface-container-high rounded transition-colors flex-1 mx-0.5">
                        <span className="material-symbols-outlined text-primary text-[10px]">schedule</span>
                        <span className="text-[5px] sm:text-[6px] font-bold tracking-widest text-on-surface-variant/70 uppercase">Horas</span>
                        <span className="font-bold text-on-surface text-[7px] sm:text-[8px]">12h</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center py-1 px-1 border border-outline-variant/10 bg-surface-container-high rounded transition-colors flex-1 mx-0.5">
                        <span className="material-symbols-outlined text-primary text-[10px]">layers</span>
                        <span className="text-[5px] sm:text-[6px] font-bold tracking-widest text-on-surface-variant/70 uppercase">Sesiones</span>
                        <span className="font-bold text-on-surface text-[7px] sm:text-[8px]">3</span>
                      </div>
                      <div className="flex flex-col items-center justify-center text-center py-1 px-1 border border-outline-variant/10 bg-surface-container-high rounded transition-colors flex-1 mx-0.5">
                        <span className="material-symbols-outlined text-primary text-[10px]">straighten</span>
                        <span className="text-[5px] sm:text-[6px] font-bold tracking-widest text-on-surface-variant/70 uppercase">Tamaño</span>
                        <span className="font-bold text-on-surface text-[7px] sm:text-[8px]">25cm</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto shrink-0">
                      <button className="w-full py-1.5 bg-primary text-on-primary font-bold uppercase tracking-widest text-[7px] sm:text-[8px] flex items-center justify-center gap-1 shadow-lg">
                        <span>Quiero este tatuaje</span>
                        <span className="material-symbols-outlined text-[8px] sm:text-[10px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
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
              <p className="text-gray-400 max-w-2xl mx-auto">Artistas de élite potenciando sus carreras.</p>
            </div>
            
            {/* Featured Spotlight */}
            <div className="w-full bg-surface-variant rounded-2xl overflow-hidden neon-border mb-8 flex flex-col md:flex-row group cursor-pointer" onClick={() => navigate('/demo/profile')}>
              <div className="w-full md:w-2/3 h-[500px] relative overflow-hidden">
                <img alt="Victor Ink" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTy79SDu2NnHX_tAaMxoahcDiJ4pf7_nJmr7uTAAHM8nxqhJff5IC5kw81q-uy-DejCNoslPvxIxRoAS0kmUW2rRVGPoXENl4-mG4KeSHwaVkHpwH697MHIwve1I-TOLV4QpKI1kNS0rrInl2u5PHFRbN-LoP9GV-4VLjLN1CD4iioFFwkH1q7TvXKkvqwEs1r2ziFSscHLtIk_MG7mMjY-BXTPPEyDPKgvKExhYN8hJQbmQ4f_-PDUbakN5_n7OX29L7XqCB9a0E" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-variant hidden md:block"></div>
              </div>
              <div className="w-full md:w-1/3 p-10 flex flex-col justify-center bg-surface-variant">
                <span className="text-primary uppercase tracking-[0.2em] font-bold text-sm mb-2">Artista Destacado (Demo)</span>
                <h3 className="text-4xl font-bold text-white mb-4">Victor Ink</h3>
                <p className="text-gray-400 mb-8">Blackwork / Minimalist. Creando piezas únicas con precisión y estética limpia. Explora la experiencia completa de nuestro software con esta cuenta de demostración.</p>
                <button className="px-8 py-3 border-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Ver Perfil Demo</button>
              </div>
            </div>
            
            {/* Mobile Carousel & Desktop Grid */}
            <div className="block md:hidden relative w-full overflow-hidden rounded-2xl neon-border h-[450px]">
                <div className="flex w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                   {fallbackPhotos.map((photo, idx) => (
                      <div key={photo.id} className="w-full h-full shrink-0 relative group">
                          <img alt={photo.alt} className="w-full h-full object-cover" src={photo.src} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6">
                              <h4 className="text-2xl font-bold text-white mb-2">{photo.title}</h4>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {photo.tags.map(tag => (
                                    <span key={tag} className="text-xs font-bold px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded uppercase tracking-widest">{tag}</span>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTy79SDu2NnHX_tAaMxoahcDiJ4pf7_nJmr7uTAAHM8nxqhJff5IC5kw81q-uy-DejCNoslPvxIxRoAS0kmUW2rRVGPoXENl4-mG4KeSHwaVkHpwH697MHIwve1I-TOLV4QpKI1kNS0rrInl2u5PHFRbN-LoP9GV-4VLjLN1CD4iioFFwkH1q7TvXKkvqwEs1r2ziFSscHLtIk_MG7mMjY-BXTPPEyDPKgvKExhYN8hJQbmQ4f_-PDUbakN5_n7OX29L7XqCB9a0E" alt="Victor Ink" className="w-8 h-8 rounded-full border border-primary/50 object-cover" />
                                <span className="text-sm text-gray-300 font-bold">@victor_ink</span>
                              </div>
                          </div>
                      </div>
                   ))}
                </div>
                {/* Indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {fallbackPhotos.map((_, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full transition-all ${activeSlide === idx ? 'bg-primary w-6' : 'bg-white/50'}`}></div>
                    ))}
                </div>
            </div>

            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
              {fallbackPhotos.map((photo) => (
                  <div key={photo.id} className="relative group overflow-hidden rounded-2xl neon-border h-[400px]">
                    <img alt={photo.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={photo.src} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                      <h4 className="text-xl font-bold text-white mb-2">{photo.title}</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {photo.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded uppercase tracking-widest">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTy79SDu2NnHX_tAaMxoahcDiJ4pf7_nJmr7uTAAHM8nxqhJff5IC5kw81q-uy-DejCNoslPvxIxRoAS0kmUW2rRVGPoXENl4-mG4KeSHwaVkHpwH697MHIwve1I-TOLV4QpKI1kNS0rrInl2u5PHFRbN-LoP9GV-4VLjLN1CD4iioFFwkH1q7TvXKkvqwEs1r2ziFSscHLtIk_MG7mMjY-BXTPPEyDPKgvKExhYN8hJQbmQ4f_-PDUbakN5_n7OX29L7XqCB9a0E" alt="Victor Ink" className="w-6 h-6 rounded-full border border-primary/50 object-cover" />
                        <span className="text-xs text-gray-300 font-bold">@victor_ink</span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final Section */}
        <section className="py-section-gap px-gutter text-center relative overflow-hidden bg-surface-container-lowest px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,77,68,0.15)_0%,#050505_70%)] pointer-events-none"></div>
          <div className="max-w-3xl mx-auto relative z-10 py-12">
            <h2 className="font-display-lg text-headline-lg md:text-[64px] font-black text-white mb-8 leading-tight">¿Listo para multiplicar<br /><span className="text-primary emerald-glow">tus reservas?</span></h2>
            <p className="font-body-lg text-gray-400 mb-12 text-xl">Deja de perder clientes potenciales en el DMs. Implementa el sistema que convierte clics en agendas completas.</p>
            <button onClick={() => { setIsRegister(true); setShowLoginModal(true); }} className="px-16 py-6 bg-primary text-white font-black text-xl uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_40px_rgba(5,77,68,0.4)] hover:shadow-[0_0_60px_rgba(5,77,68,0.6)] scale-100 hover:scale-105">Quiero mi página</button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap px-gutter flex flex-col items-center gap-unit text-center bg-surface-container-lowest border-t border-outline-variant/10 px-6">
        <div className="mb-8">
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold uppercase tracking-tighter">Turnos <span className="text-primary">Tattoo</span></span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary underline transition-opacity opacity-80 hover:opacity-100" href="#">Terms</a>
          <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary underline transition-opacity opacity-80 hover:opacity-100" href="#">Privacy</a>
          <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary underline transition-opacity opacity-80 hover:opacity-100" href="#">Contact</a>
          <a className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary underline transition-opacity opacity-80 hover:opacity-100" href="#">Join Us</a>
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
                  <a className="text-on-surface font-bold hover:text-primary transition-colors ml-1 md:ml-2 underline decoration-primary underline-offset-4 block mt-2 md:inline md:mt-0" href="#">
                    Quiero mi página
                  </a>
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
    </>
  );
}
