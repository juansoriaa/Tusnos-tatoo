import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from './DemoLayout';
import { db, auth, onAuthStateChanged } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useSubscription } from '../hooks/useSubscription';


const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo';
const defaultBanner = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjcpGXPEz0beDBlZrbWo96kxL8SYcB5zMiiXz1xbrFmwvqYW5GPQex6oox-awu_xzVDV-xVHBOZb7J5FaWinZxyv-p_dVvx7nyqWDm8DE96ZCcZjiGx9i8SoPVlU1tgx7piOQQuHe-KPGo797xTz3-Hah3jLnvIr5MmnaWY0vzOsFmANOtV305mcB8ioZWPXCwwEkhO3pFM2gsdfbO2cw8vwlVJxKBOTpjtD1hKf22NaaGM7lT4hpZ-5-bVKccq_JRci5J0v0uXR0';

export default function DemoDashboard() {
    const navigate = useNavigate();

const defaultFaqs = [
  { question: '¿Qué tengo que hacer antes del tatuaje?', answer: 'Venir bien descansado, haber comido bien antes de la sesión y no consumir alcohol ni drogas 24 horas antes. Mantener la piel hidratada los días previos ayuda mucho.' },
  { question: '¿Qué hacer después?', answer: 'Lavar la zona con jabón neutro 2-3 veces al día, aplicar una capa muy fina de crema cicatrizante, no rascar, no exponer al sol directo y evitar piletas/mar por 15 días.' },
  { question: 'Recomendación del tatuador', answer: 'Confía en el proceso y en el diseño. Las mejores piezas surgen cuando hay libertad creativa para adaptar la idea a la anatomía de tu cuerpo.' },
  { question: '¿Duele tatuarse?', answer: 'El dolor es subjetivo y depende de la zona del cuerpo y la tolerancia de cada persona. Generalmente se siente como un rasguño constante, pero es totalmente soportable.' }
];

    const [faqs, setFaqs] = useState(defaultFaqs);
    const [isAvailable, setIsAvailable] = useState(true);
    const [modalOpen, setModalOpen] = useState<string | null>(null);
    const [animateHighlight, setAnimateHighlight] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    useEffect(() => {
        let unsubscribe = () => {};
        const localUid = localStorage.getItem('demoUserId');
        if (localUid) {
            loadData(localUid);
        } else {
            unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) loadData(user.uid);
            });
        }
        async function loadData(demoUserId: string) {
            let data = null;
            if (demoUserId) {
                try {
                    const cacheStr = localStorage.getItem('demoArtistData_' + demoUserId);
                    if (cacheStr) {
                        data = JSON.parse(cacheStr);
                    } else {
                        const { globalPreloadCache } = await import('../lib/cache');
                        if (globalPreloadCache[demoUserId]?.artistData) {
                            data = globalPreloadCache[demoUserId].artistData;
                        }
                    }
                    if (!data) {
                        const docSnap = await getDoc(doc(db, 'users', demoUserId));
                    if (docSnap.exists()) {
                            data = docSnap.data();
                        }
                    }
                } catch (e) {
                    console.error("Error loading from Firestore", e);
                }
            }
            if (!data) {
                const saved = localStorage.getItem('demoArtistData_demo');
                if (saved) {
                    try { data = JSON.parse(saved); } catch (e) {}
                }
            }
            if (data) {
                try {
                setName(data.displayName || 'Victor Ink');
                setBio(data.bio || 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.');
                setSpecialty1((data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[0] || '') : 'Realismo');
                setSpecialty2((data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[1] || '') : 'Black & Grey');
                setSpecialty3(data.specialtyTags?.[2] || '');
                setIsAvailable(data.isAvailable !== false);
                setWhatsapp(data.whatsapp || '');
                setLoginEmail(data.email || '');
                setCustomPassword(data.customPassword || '');
                setInstagram(data.instagram || '');
                setFacebook(data.facebook || '');
                setTiktok(data.tiktok || '');
                setAvatarUrl(data.profilePhotoUrl || defaultAvatar);
                setBannerUrl((data.backgroundPhotos && data.backgroundPhotos.length > 0 && data.backgroundPhotos[0]) ? data.backgroundPhotos[0] : defaultBanner);
                setMapLink(data.mapLink || '');
                setHasPhysicalStudio(data.hasPhysicalStudio !== false);
                setStudioName(data.studioName || '');
                setStudioDescription(data.studioDescription || '');
                setStudioAddress(data.studioAddress || '');
                if (data.faqs) setFaqs(data.faqs);
                setStudioHours(data.studioHours || '');
                setSubscriptionStatus(data.subscriptionStatus || 'active');
                setSubscriptionEndsAt(data.subscriptionEndsAt || null);
            
                setInitialDataStr(JSON.stringify({
                    name: data.displayName || 'Victor Ink',
                    bio: data.bio || 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                    specialty1: (data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[0] || '') : 'Realismo',
                    specialty2: (data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[1] || '') : 'Black & Grey',
                    specialty3: data.specialtyTags?.[2] || '',
                    isAvailable: data.isAvailable !== false,
                    whatsapp: data.whatsapp || '',
                    loginEmail: data.email || '',
                    customPassword: data.customPassword || '',
                    instagram: data.instagram || '',
                    facebook: data.facebook || '',
                    tiktok: data.tiktok || '',
                    avatarUrl: data.profilePhotoUrl || defaultAvatar,
                    bannerUrl: (data.backgroundPhotos && data.backgroundPhotos.length > 0 && data.backgroundPhotos[0]) ? data.backgroundPhotos[0] : defaultBanner,
                    hasPhysicalStudio: data.hasPhysicalStudio !== false,
                    studioName: data.studioName || '',
                    studioDescription: data.studioDescription || '',
                    studioAddress: data.studioAddress || '',
                    studioHours: data.studioHours || '',
                    mapLink: data.mapLink || '',
                    faqs: data.faqs || defaultFaqs
                }));
            } catch (e) { console.error('Error in setInitialDataStr block', e); }
        } else {
            const initData = {
                name: 'Victor Ink',
                bio: 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                specialty1: 'Realismo',
                specialty2: 'Black & Grey',
                specialty3: '',
                isAvailable: true,
                whatsapp: '',
                loginEmail: '',
                customPassword: '',
                instagram: '',
                facebook: '',
                tiktok: '',
                avatarUrl: defaultAvatar,
                bannerUrl: defaultBanner,
                hasPhysicalStudio: true,
                studioName: '',
                studioDescription: '',
                studioAddress: '',
                studioHours: '',
                mapLink: '',
                faqs: defaultFaqs
            };
            setName(initData.name);
            setBio(initData.bio);
            setSpecialty1(initData.specialty1);
            setSpecialty2(initData.specialty2);
            setSpecialty3(initData.specialty3);
            setIsAvailable(initData.isAvailable);
            setWhatsapp(initData.whatsapp);
            setLoginEmail(initData.loginEmail);
            setCustomPassword(initData.customPassword);
            setInstagram(initData.instagram);
            setFacebook(initData.facebook);
            setTiktok(initData.tiktok);
            setAvatarUrl(initData.avatarUrl);
            setBannerUrl(initData.bannerUrl);
            setHasPhysicalStudio(initData.hasPhysicalStudio);
            setStudioName(initData.studioName);
            setStudioDescription(initData.studioDescription);
            setStudioAddress(initData.studioAddress);
            setStudioHours(initData.studioHours);
            setMapLink(initData.mapLink);
            setFaqs(initData.faqs);
            setInitialDataStr(JSON.stringify(initData));
        }
        };
    }, []); // Subscribe to auth changes instead of manual call

    const [name, setName] = useState('Victor Ink');
    const [bio, setBio] = useState('Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.');
    const [specialty1, setSpecialty1] = useState('Realismo');
    const [specialty2, setSpecialty2] = useState('Black & Grey');
    const [specialty3, setSpecialty3] = useState('');
    const [mapLink, setMapLink] = useState('');
    const [hasPhysicalStudio, setHasPhysicalStudio] = useState(true);
    const [studioName, setStudioName] = useState('');
    const [studioDescription, setStudioDescription] = useState('');
    const [studioAddress, setStudioAddress] = useState('');
    const [studioHours, setStudioHours] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [customPassword, setCustomPassword] = useState('');
    const [instagram, setInstagram] = useState('');
    const [facebook, setFacebook] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [subscriptionStatus, setSubscriptionStatus] = useState('active');
    const [subscriptionEndsAt, setSubscriptionEndsAt] = useState<any>(null);

    const subscription = useSubscription(subscriptionStatus, subscriptionEndsAt);
    const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);
    const [bannerUrl, setBannerUrl] = useState(defaultBanner);

    
    const [initialDataStr, setInitialDataStr] = useState('');

    
    const [pendingNav, setPendingNav] = useState<string | null>(null);

    const handleNavigate = (path: string) => {
        if (hasUnsavedChanges) {
            setPendingNav(path);
        } else {
            navigate(path);
        }
    };

    const currentData = {
        name,
        bio,
        specialty1,
        specialty2,
        specialty3,
        isAvailable,
        whatsapp,
        loginEmail,
        customPassword,
        instagram,
        facebook,
        tiktok,
        avatarUrl,
        bannerUrl,
        hasPhysicalStudio,
        studioName,
        studioDescription,
        studioAddress,
        studioHours,
        mapLink,
        faqs
    };
    const currentDataStr = JSON.stringify(currentData);
    let hasUnsavedChanges = false;
    if (initialDataStr !== '') {
        try {
            const initialData = JSON.parse(initialDataStr);
            for (const key in currentData) {
                if (JSON.stringify(currentData[key]) !== JSON.stringify(initialData[key])) {
                    hasUnsavedChanges = true;
                    break;
                }
            }
        } catch(e) {}
    }

    const handleSaveAll = () => {
        const demoData = {
            displayName: name,
            bio: bio,
            specialtyTags: [specialty1, specialty2, specialty3].filter(Boolean),
            isAvailable: isAvailable,
            whatsapp: whatsapp,
            email: loginEmail,
            customPassword: customPassword,
            instagram: instagram,
            facebook: facebook,
            tiktok: tiktok,
            mapLink: mapLink,
            hasPhysicalStudio: hasPhysicalStudio,
            studioName: studioName,
            studioDescription: studioDescription,
            studioAddress: studioAddress,
            studioHours: studioHours,
            profilePhotoUrl: avatarUrl,
            backgroundPhotos: [bannerUrl],
            faqs: faqs
        };
        
        const demoUserId = (localStorage.getItem('demoUserId') || auth.currentUser?.uid || 'demo');
        const cacheKey = 'demoArtistData_' + demoUserId;
        try {
            const existingCache = localStorage.getItem(cacheKey);
            let mergedData = demoData;
            if (existingCache) {
                mergedData = { ...JSON.parse(existingCache), ...demoData };
            }
            localStorage.setItem(cacheKey, JSON.stringify(mergedData));
            // Also update the generic demo cache for backward compatibility
            const existingDemo = localStorage.getItem('demoArtistData_demo');
            let mergedDemo = demoData;
            if (existingDemo) {
                mergedDemo = { ...JSON.parse(existingDemo), ...demoData };
            }
            localStorage.setItem('demoArtistData_demo', JSON.stringify(mergedDemo));
        } catch(e) {}

        if (demoUserId && demoUserId !== 'demo') {
            updateDoc(doc(db, 'users', demoUserId), demoData).catch(e => console.error("Error saving to Firestore", e));
        }
        window.dispatchEvent(new CustomEvent('profileDataChanged'));
        setInitialDataStr(JSON.stringify(currentData));
        setToastMessage("Cambios guardados exitosamente!");
        setTimeout(() => setToastMessage(null), 3000);
    };

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const [metrics, setMetrics] = useState({
        views: 0,
        photoClicks: 0,
        whatsappClicks: 0,
        agendaClicks: 0
    });

    const [animating, setAnimating] = useState(false);
    const [periodIndex, setPeriodIndex] = useState(0);
    const periods = ['day', 'week', 'month'];
    const periodLabels = { day: 'Hoy', week: 'Esta sem', month: 'Este mes' };
        
    useEffect(() => {
        let unsubscribe = () => {};
        const localUid = localStorage.getItem('demoUserId');
        if (localUid) {
            loadMetrics(localUid);
        } else {
            unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) loadMetrics(user.uid);
            });
        }
        async function loadMetrics(demoUserId?: string) {
            let parsed = null;
            if (demoUserId) {
                try {
                    const { doc, getDoc } = await import('firebase/firestore');
                    const docSnap = await getDoc(doc(db, 'users', demoUserId));
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.userTag === '@demo' || data.userTag === '@victor_ink' || data.userTag === 'victor_ink' || data.userTag === 'demo') {
                            parsed = {
                                views: 12400,
                                photoClicks: 1200,
                                whatsappClicks: 856,
                                agendaClicks: 48
                            };
                        } else {
                            parsed = {
                                views: data.views || 0,
                                photoClicks: data.photoClicks || 0,
                                whatsappClicks: data.whatsappClicks || 0,
                                agendaClicks: data.agendaClicks || 0
                            };
                        }
                    }
                } catch(e) {}
            }
            if (parsed) {
                try {
                    setMetrics(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
                            setAnimating(true);
                            setTimeout(() => setAnimating(false), 1000);
                        }
                        return parsed;
                    });
                } catch (e) {}
            }
        };
        loadMetrics(localStorage.getItem('demoUserId') || undefined);
        const handleMetrics = () => loadMetrics(localStorage.getItem('demoUserId') || undefined); window.addEventListener('demoMetricsUpdated', handleMetrics);
        return () => window.removeEventListener('demoMetricsUpdated', handleMetrics);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPeriodIndex(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const currentPeriod = periods[periodIndex];

    const calcIncrease = (current, periodKey, metricName) => {
        if (current === 0) return '0.0%';
        // Mock a reasonable increase based on period if we have actual data
        let factor = 0.05;
        if (periodKey === 'week') factor = 0.12;
        if (periodKey === 'month') factor = 0.25;
        
        return '+' + (factor * 100).toFixed(1) + '%';
    };
    
    const formatNumber = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };


    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setUrl: React.Dispatch<React.SetStateAction<string>>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo excede el tamaño máximo de 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Max dimensions to avoid localStorage quota issues
                    const MAX_WIDTH = 1200;
                    const MAX_HEIGHT = 1200;
                    
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height = Math.round((height * MAX_WIDTH) / width);
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width = Math.round((width * MAX_HEIGHT) / height);
                            height = MAX_HEIGHT;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                        setUrl(dataUrl);
                    }
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPwaPrompt, setShowPwaPrompt] = useState(false);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log('beforeinstallprompt captured');
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    useEffect(() => {
        if (deferredPrompt) {
            const timer = setTimeout(() => {
                const hasDeclined = localStorage.getItem('pwa_declined');
                if (!hasDeclined) {
                    setShowPwaPrompt(true);
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [deferredPrompt]);

    const handleInstallPwa = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('PWA prompt outcome:', outcome);
            setDeferredPrompt(null);
            setShowPwaPrompt(false);
        }
    };

    const handleDeclinePwa = () => {
        localStorage.setItem('pwa_declined', 'true');
        setShowPwaPrompt(false);
    };

    useEffect(() => {
        // Only generate the manifest once we have actually loaded user data (initialDataStr is set) 
        // to avoid caching the default generic "Victor Ink" name when the component first mounts.
        if (name && initialDataStr !== '') {
            const generateManifest = () => {
                let iconSrc = '/default-avatar.png';
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 512;
                    canvas.height = 512;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.fillStyle = '#054d44'; // primary color
                        ctx.fillRect(0, 0, 512, 512);
                        
                        ctx.fillStyle = '#ffffff';
                        ctx.font = 'bold 80px sans-serif';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText('Turnos', 256, 210);
                        
                        ctx.fillStyle = '#a8ffea'; // accent color
                        ctx.fillText('Tattoo', 256, 310);
                        
                        iconSrc = canvas.toDataURL('image/png');
                    }
                } catch (e) {
                    console.error('Error generating brand logo', e);
                }

                const manifest = {
                    name: `${name} - Turnos Tattoo`,
                    short_name: name,
                    start_url: window.location.pathname, // Ensure we open the exact dashboard path, not a wildcard
                    display: "standalone",
                    background_color: "#000000",
                    theme_color: "#054d44",
                    icons: [
                        {
                            src: iconSrc,
                            sizes: "512x512",
                            type: "image/png",
                            purpose: "any maskable"
                        },
                        {
                            src: iconSrc,
                            sizes: "192x192",
                            type: "image/png",
                            purpose: "any maskable"
                        }
                    ]
                };
                const stringManifest = JSON.stringify(manifest);
                // Utilizar Data URL en lugar de Blob para evitar problemas de permisos/lectura en el proceso de instalación de Android
                const manifestUrl = 'data:application/json;charset=utf-8,' + encodeURIComponent(stringManifest);
                
                let link = document.querySelector('link[rel="manifest"]');
                if (link) {
                    link.setAttribute('href', manifestUrl);
                } else {
                    link = document.createElement('link');
                    link.setAttribute('rel', 'manifest');
                    link.setAttribute('href', manifestUrl);
                    document.head.appendChild(link);
                }
            };
            generateManifest();
        }
    }, [name, initialDataStr]);

    return (
        <DemoLayout 
            onNavigate={handleNavigate}
            activeTab="dashboard"
            titlePrefix="Gestión de"
            titleAccent="Estudio"
            description="Resumen de tu negocio, estado de turnos y perfil de artista."
        >
            <div className="flex flex-col gap-6">
                {showPwaPrompt && (
                    <div className="bg-primary/20 border border-primary/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-primary/30">
                                <img src={avatarUrl.startsWith('http') ? avatarUrl : '/default-avatar.png'} alt="PWA Icon" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-sm">Instalar Aplicación</h3>
                                <p className="text-on-surface-variant text-xs">Añade un acceso directo para tener todas tus configuraciones a mano.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button onClick={handleDeclinePwa} className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-secondary hover:text-white transition-colors">
                                Quizás luego
                            </button>
                            <button onClick={handleInstallPwa} className="flex-1 sm:flex-none px-4 py-2 bg-primary text-on-primary rounded text-xs font-bold hover:bg-primary-fixed transition-colors">
                                Instalar App
                            </button>
                        </div>
                    </div>
                )}
                {subscription.status === 'expired' && (
                    <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 text-center">
                        <p className="text-white font-bold mb-2">Tu perfil público ha sido temporalmente suspendido por falta de pago.</p>
                        <a href="https://wa.me/5491140679334" target="_blank" rel="noopener noreferrer" className="inline-block bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-500 transition">
                            Contactar al Administrador
                        </a>
                    </div>
                )}
                {(subscription.status === 'warning_trial' || subscription.status === 'warning_monthly') && (
                    <div className="bg-amber-950/20 border border-amber-700/30 rounded-xl p-3 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                        <p className="text-amber-200/90 text-sm md:text-base font-medium">
                            {subscription.status === 'warning_trial' 
                                ? `Te quedan ${subscription.daysLeft} días de tu período de prueba. Contacta al administrador para activar tu plan.` 
                                : `Tu mensualidad vence en ${subscription.daysLeft} días. Contacta al administrador para renovar tu suscripción.`}
                        </p>
                        <a href="https://wa.me/5491140679334" target="_blank" rel="noopener noreferrer" className="bg-amber-600/80 hover:bg-amber-500 text-white px-3 py-1.5 rounded text-sm font-bold transition whitespace-nowrap">
                            Renovar ahora
                        </a>
                    </div>
                )}
                {/* Header / Booking Status */}
                <header className="flex flex-col gap-6 mb-8">
                    <div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface text-2xl mb-3">Bienvenido, {name}</h2>
                        
                        <p className="text-on-surface-variant mt-2 text-sm">Gestiona tu estudio y agenda desde aquí.</p>
                    </div>
                    {/* Booking Status: Heart of the Project */}
                    <div className={`w-full bg-surface-container-low p-6 border-2 flex items-center justify-between gap-4 transition-all duration-300 ${animateHighlight ? 'scale-[1.02] shadow-[0_0_30px_rgba(255,180,171,0.6)] border-error' : (!isAvailable ? 'border-error shadow-[0_0_15px_rgba(255,180,171,0.2)]' : 'border-primary shadow-[0_0_15px_rgba(5,77,68,0.2)]')}`} style={{borderColor: !isAvailable ? '#ffb4ab' : '#054d44'}}>
                        <div className="flex flex-col">
                            <span className="font-label-md text-[10px] uppercase tracking-widest text-primary mb-1" style={{color: '#054d44', fontWeight: 700}}>Estado de Agenda</span>
                            <span className={`font-headline-md text-xl ${!isAvailable ? 'text-error' : 'text-on-surface'}`} id="booking-status-text">{!isAvailable ? 'TURNOS LLENOS' : 'DISPONIBLE'}</span>
                        </div>
                        <div className="relative inline-block w-16 h-8 align-middle select-none transition duration-200 ease-in shrink-0">
                            <input 
                                className="toggle-checkbox peer absolute block w-8 h-8 rounded-none bg-surface border-2 border-outline-variant appearance-none cursor-pointer z-10 checked:translate-x-8 checked:border-emerald-accent transition-transform duration-300 ease-in-out" 
                                id="toggle" 
                                name="toggle" 
                                type="checkbox"
                                checked={!isAvailable}
                                onChange={(e) => {
    const newIsAvailable = !e.target.checked;
    setIsAvailable(newIsAvailable);
    if (!newIsAvailable) {
        setAnimateHighlight(true);
        setTimeout(() => setAnimateHighlight(false), 2000);
    }
    
    // Save to localStorage immediately so DemoLayout state is preserved across route changes
    try {
        const saved = localStorage.getItem('demoArtistData_demo');
        let data = saved ? JSON.parse(saved) : {};
        data.isAvailable = newIsAvailable;
        localStorage.setItem('demoArtistData_demo', JSON.stringify(data));
        const demoUserId = (localStorage.getItem('demoUserId') || auth.currentUser?.uid);
        if (demoUserId) {
            updateDoc(doc(db, 'users', demoUserId), { isAvailable: newIsAvailable }).catch(e => console.error(e));
        }
    } catch(err) {}

    window.dispatchEvent(new CustomEvent('agendaStatusChanged', { detail: newIsAvailable }));
}}
style={{borderColor: !isAvailable ? '#054d44' : ''}}
                            />
                            <label className="toggle-label block overflow-hidden h-8 rounded-none bg-surface-variant cursor-pointer peer-checked:bg-primary/20 transition-colors duration-300" htmlFor="toggle"></label>
                        </div>
                    </div>
                </header>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Profile Config Section */}
                    <section className="space-y-6">
                        <div className="bg-surface-container p-6 border border-outline-variant/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{color: '#054d44'}}>edit_note</span>
                                </div>
                                <h3 className="font-headline-md text-sm font-bold uppercase tracking-widest text-on-surface">Profile Config</h3>
                            </div>
                            
                            <div className="space-y-8">
                                {/* Banner Upload */}
                                <label className="group relative h-32 bg-surface-container-lowest border border-dashed border-outline-variant/40 flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-primary block">
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setBannerUrl)} />
                                    <div className="absolute inset-0 opacity-20 grayscale">
                                        <div className="w-full h-full bg-cover bg-center" style={{backgroundImage: `url('${bannerUrl}')`}}></div>
                                    </div>
                                    <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                                        <span className="material-symbols-outlined text-2xl" data-icon="add_a_photo">add_a_photo</span>
                                        <p className="font-label-md text-xs uppercase">Cambiar Banner</p>
                                        <p className="font-caption text-[10px] text-on-surface-variant px-4">Recomendado: 1200x400px. Máx: 5MB.<br/>(Se aplica filtro oscuro)</p>
                                    </div>
                                </label>

                                <div className="flex flex-col gap-6">
                                    {/* Profile Pic */}
                                    <div className="shrink-0 mx-auto flex flex-col items-center text-center">
                                        <label className="w-24 h-24 bg-surface-container-highest border border-outline-variant/20 flex items-center justify-center relative group cursor-pointer overflow-hidden block">
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, setAvatarUrl)} />
                                            <img className="w-full h-full object-cover" src={avatarUrl || undefined} />
                                            <div className="absolute inset-0 bg-surface/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined" data-icon="upload">upload</span>
                                            </div>
                                        </label>
                                        <p className="text-caption font-caption text-center mt-2 uppercase text-on-surface-variant">Avatar</p>
                                        <p className="font-caption text-[10px] text-on-surface-variant mt-1">Recomendado: 400x400px.<br/>Máx: 5MB.</p>
                                    </div>
                                    {/* Bio & Info */}
                                    <div className="space-y-6">
                                        <div className="relative">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Nombre / Alias</label>
                                            <input className="w-full bg-transparent border-b border-outline-variant/30 py-2 text-sm focus:border-primary focus:ring-0 outline-none transition-colors" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                                        </div>
                                        <div className="relative">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Bio</label>
                                            <textarea className="w-full bg-transparent border-b border-outline-variant/30 py-2 text-sm focus:border-primary focus:ring-0 outline-none transition-colors resize-none" rows={3} value={bio} onChange={(e) => setBio(e.target.value)}></textarea>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Social Links with additions */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3 bg-surface-container-low p-3 border border-outline-variant/10 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-primary shrink-0" style={{color: '#054d44'}}>
                                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c-.003 1.396.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                                        </svg>
                                        <input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="11 1234 5678" type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value.replace(/[^0-9s-]/g, ''))} />
                                        {whatsapp.replace(/[^0-9]/g, '').length >= 10 && (
                                            <span className="material-symbols-outlined text-emerald-accent text-sm absolute right-3 animate-fade-in" style={{color: '#054d44'}}>check_circle</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 bg-surface-container-low p-3 border border-outline-variant/10 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-on-surface-variant shrink-0">
                                          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.036 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                                        </svg>
                                        <input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="Instagram URL" type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                                        {(instagram.includes('instagram.com') && instagram.length > 15) && (
                                            <span className="material-symbols-outlined text-emerald-accent text-sm absolute right-3 animate-fade-in" style={{color: '#054d44'}}>check_circle</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 bg-surface-container-low p-3 border border-outline-variant/10 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-on-surface-variant shrink-0">
                                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                                        </svg>
                                        <input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="Facebook URL" type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                                        {(facebook.includes('facebook.com') && facebook.length > 14) && (
                                            <span className="material-symbols-outlined text-emerald-accent text-sm absolute right-3 animate-fade-in" style={{color: '#054d44'}}>check_circle</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 bg-surface-container-low p-3 border border-outline-variant/10 relative">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="text-on-surface-variant shrink-0">
                                          <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z"/>
                                        </svg>
                                        <input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="TikTok URL" type="text" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
                                        {(tiktok.includes('tiktok.com') && tiktok.length > 12) && (
                                            <span className="material-symbols-outlined text-emerald-accent text-sm absolute right-3 animate-fade-in" style={{color: '#054d44'}}>check_circle</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Specialties Section */}
                        <div className="bg-surface-container p-6 border border-outline-variant/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{color: '#054d44'}}>military_tech</span>
                                </div>
                                <h3 className="font-headline-md text-sm font-bold uppercase tracking-widest text-on-surface">Especialidades (Max 3)</h3>
                            </div>
                            {(() => {
                                const tags = [specialty1, specialty2, specialty3].filter(Boolean);
                                if (tags.length === 0) return null;
                                const count = tags.length;
                                let containerClass = "flex mb-6 w-full justify-center ";
                                if (count === 1) containerClass += "gap-2";
                                else if (count === 2) containerClass += "gap-4";
                                else containerClass += "gap-2";
                                
                                return (
                                    <div className={containerClass}>
                                        {tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-background border border-primary font-caption text-[9px] md:text-xs text-primary uppercase tracking-widest whitespace-nowrap truncate max-w-[30%] text-center shadow-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                );
                            })()}
                            <div className="grid grid-cols-1 gap-3">
                                <input className="bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Especialidad 1" type="text" value={specialty1} onChange={(e) => setSpecialty1(e.target.value)} />
                                <input className="bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Especialidad 2" type="text" value={specialty2} onChange={(e) => setSpecialty2(e.target.value)} />
                                <input className="bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Especialidad 3" type="text" value={specialty3} onChange={(e) => setSpecialty3(e.target.value)} />
                            </div>
                        </div>

                        {/* Studio Location Section */}
                        <div className="bg-surface-container p-6 border border-outline-variant/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{color: '#054d44'}}>location_on</span>
                                </div>
                                <h3 className="font-headline-md text-sm font-bold uppercase tracking-widest text-on-surface">Ubicación del Estudio</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-surface-container-low p-4 border border-outline-variant/10">
                                    <span className="font-caption text-sm uppercase tracking-wider text-on-surface">¿Atiendes en un estudio físico?</span>
                                    <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                                        <input 
                                            type="checkbox" 
                                            className="toggle-checkbox peer absolute block w-6 h-6 rounded-none bg-surface border-2 border-outline-variant appearance-none cursor-pointer z-10 checked:translate-x-6 checked:border-emerald-accent transition-transform duration-300 ease-in-out" 
                                            checked={hasPhysicalStudio} 
                                            onChange={(e) => setHasPhysicalStudio(e.target.checked)} 
                                        />
                                        <label className="toggle-label block overflow-hidden h-6 rounded-none bg-surface-container-highest border border-outline-variant cursor-pointer"></label>
                                    </div>
                                </div>

                                {hasPhysicalStudio && (
                                    <div className="flex flex-col gap-4 animate-fade-in">
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Nombre del estudio</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Ej: Turnos Tattoo Studio" type="text" value={studioName} onChange={(e) => setStudioName(e.target.value)} />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Breve descripción</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Ej: Estudio privado, solo con cita previa" type="text" value={studioDescription} onChange={(e) => setStudioDescription(e.target.value)} />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Dirección, Distrito y Ciudad</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Ej: Calle 124, Florencio Varela, GBA Sur" type="text" value={studioAddress} onChange={(e) => setStudioAddress(e.target.value)} />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Días y Horarios</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Ej: Lunes a Sábados de 14:00 a 20:00 hs" type="text" value={studioHours} onChange={(e) => setStudioHours(e.target.value)} />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Link de Google Maps</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="https://maps.app.goo.gl/..." type="text" value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
                                            <p className="text-[10px] text-on-surface-variant/70 mt-1 uppercase tracking-wider">El link hará que la dirección sea clickeable y lleve al mapa.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                        </div>
                    </section>

                    {/* FAQ Editor Section */}
                    <section className="space-y-6">
                        <div className="bg-surface-container p-6 border border-outline-variant/10 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary" style={{color: '#054d44'}}>quiz</span>
                                    <h3 className="font-headline-md text-lg uppercase tracking-tight">Preguntas Frecuentes</h3>
                                </div>
                                <button 
                                    onClick={() => setFaqs([...faqs, { question: 'Nueva pregunta', answer: 'Nueva respuesta' }])}
                                    className="bg-primary/10 hover:bg-primary/20 text-primary transition-colors rounded-full p-2 flex items-center justify-center"
                                    style={{color: '#054d44'}}
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                {faqs.map((faq, index) => (
                                    <details key={index} className="bg-surface-container-high border border-outline-variant/30 group">
                                        <summary className="font-label-md text-on-surface uppercase font-bold p-4 cursor-pointer flex justify-between items-center list-none">
                                            <input 
                                                type="text" 
                                                value={faq.question}
                                                onChange={(e) => {
                                                    const newFaqs = [...faqs];
                                                    newFaqs[index].question = e.target.value;
                                                    setFaqs(newFaqs);
                                                }}
                                                className="bg-transparent border-b border-transparent hover:border-outline-variant focus:border-primary outline-none flex-grow mr-4 text-sm"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const newFaqs = faqs.filter((_, i) => i !== index);
                                                        setFaqs(newFaqs);
                                                    }}
                                                    className="text-error hover:bg-error/10 p-1 rounded transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                                            </div>
                                        </summary>
                                        <div className="p-4 pt-0">
                                            <textarea 
                                                value={faq.answer}
                                                onChange={(e) => {
                                                    const newFaqs = [...faqs];
                                                    newFaqs[index].answer = e.target.value;
                                                    setFaqs(newFaqs);
                                                }}
                                                className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 text-on-surface-variant font-body-md text-sm outline-none focus:border-primary min-h-[100px] resize-y"
                                                placeholder="Escribe la respuesta aquí..."
                                            />
                                        </div>
                                    </details>
                                ))}
                            </div>
                            
                            
                        </div>
                    </section>
                </div>
            </div>
        
        {hasUnsavedChanges && (
            <button 
                onClick={handleSaveAll}
                className="fixed bottom-24 md:bottom-12 right-6 md:right-12 z-[100] w-14 h-14 rounded-full bg-emerald-accent text-on-primary flex items-center justify-center shadow-[0_0_20px_rgba(5,77,68,0.6)] hover:scale-110 active:scale-95 transition-all animate-bounce-slow"
                style={{backgroundColor: '#054d44'}}
                title="Guardar todos los cambios"
            >
                <span className="material-symbols-outlined text-2xl">save</span>
            </button>
        )}

        
        {pendingNav && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <div className="bg-surface-container w-full max-w-sm rounded-2xl border border-outline-variant/30 p-6 flex flex-col items-center text-center shadow-2xl">
                    <span className="material-symbols-outlined text-4xl text-error mb-4">warning</span>
                    <h3 className="font-headline-md text-xl font-bold uppercase tracking-tighter mb-2">Cambios sin guardar</h3>
                    <p className="text-on-surface-variant text-sm mb-6">Si sales ahora, perderás los cambios que no hayas guardado.</p>
                    <div className="flex w-full gap-3">
                        <button 
                            onClick={() => setPendingNav(null)}
                            className="flex-1 py-3 bg-surface-variant text-on-surface uppercase text-xs font-bold tracking-widest rounded transition-colors hover:bg-surface-container-highest"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => {
                                setInitialDataStr(currentDataStr); // mock save to allow exit
                                navigate(pendingNav);
                            }}
                            className="flex-1 py-3 bg-error text-on-error uppercase text-xs font-bold tracking-widest rounded transition-colors hover:opacity-90"
                        >
                            Descartar
                        </button>
                    </div>
                </div>
            </div>
        )}



        {toastMessage && (
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] animate-fade-in pointer-events-none w-[90%] max-w-sm">
                <div className="bg-[#054d44] text-white px-6 py-4 rounded shadow-2xl flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined text-white">check_circle</span>
                    <span className="text-sm font-bold tracking-widest uppercase">{toastMessage}</span>
                </div>
            </div>
        )}
        </DemoLayout>
    );
}


