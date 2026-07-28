import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth, onAuthStateChanged } from '../firebase';

interface DemoLayoutProps {
    children: React.ReactNode;
    activeTab: 'dashboard' | 'portfolio' | 'schedule' | 'metrics';
    titlePrefix?: string;
    titleAccent?: string;
    description?: string;

    onNavigate?: (path: string) => void;
}


export default function DemoLayout
({ children, activeTab, titlePrefix, titleAccent, description, onNavigate }: DemoLayoutProps) {
    const navigate = useNavigate();
    const [authUid, setAuthUid] = useState<string | null>(null);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    const [animateHighlight, setAnimateHighlight] = useState(false);

    const [waitlistCount, setWaitlistCount] = useState(3);

    useEffect(() => {
        let unsubscribe = () => {};
        const load = async () => {
            const demoUserId = authUid || localStorage.getItem('demoUserId');
            if (demoUserId) {
                const { collection, onSnapshot, query, where, doc, getDoc } = await import('firebase/firestore');
                
                getDoc(doc(db, 'users', demoUserId)).then(userDoc => {
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setTurnosLlenos(data.isAvailable === false);
                        if (data.profilePhotoUrl) setAvatarUrl(data.profilePhotoUrl);
                    }
                }).catch(e => console.error(e));

                const q = query(collection(db, 'users', demoUserId, 'waitlist'), where('read', '==', false));
                unsubscribe = onSnapshot(q, (snapshot) => {
                    setWaitlistCount(snapshot.docs.length);
                });
            }
        };
        load();
        return () => unsubscribe();
    }, [authUid]);
        const [avatarUrl, setAvatarUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo');
    const [turnosLlenos, setTurnosLlenos] = useState(false);


    useEffect(() => {
        let authUnsubscribe = () => {};
        
        const localUid = localStorage.getItem('demoUserId');
        if (localUid) {
            setAuthUid(localUid);
            setIsAuthChecking(false);
        } else {
            authUnsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setAuthUid(user.uid);
                    setIsAuthChecking(false);
                } else {
                    navigate('/?login=true');
                }
            });
        }
        return () => authUnsubscribe();
    }, [navigate]);


    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [configEmail, setConfigEmail] = useState('');
    const [currentUserTag, setCurrentUserTag] = useState('');
    const [configPassword, setConfigPassword] = useState('');
    const [showConfigPassword, setShowConfigPassword] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<any>(null);


    useEffect(() => {
        const demoUserId = authUid;
        if (demoUserId) {
            const q = query(collection(db, 'users', demoUserId, 'notifications'), orderBy('date', 'desc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const notifs: any[] = [];
                snapshot.forEach((doc) => {
                    notifs.push({ ...doc.data(), id: String(doc.id) });
                });
                setNotifications(notifs);
            }, (error) => {
                console.warn("Firestore onSnapshot error (ignoring for demo):", error);
            });
            return () => unsubscribe();
        }
    }, [authUid]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleReadNotification = async (notif: any) => {
        setSelectedNotification(notif);
        if (!notif.read) {
            const demoUserId = authUid;
            if (demoUserId) {
                try {
                    await updateDoc(doc(db, 'users', demoUserId, 'notifications', notif.id), {
                        read: true
                    });
                } catch (error) {
                    console.error("Error marking notification as read", error);
                }
            }
        }
    };

    useEffect(() => {
        const fetchDemoUser = async () => {
            const demoUserId = authUid;
            if (demoUserId) {
                try {
                    const docSnap = await getDoc(doc(db, 'users', demoUserId));
                    if (docSnap.exists()) {
                        setConfigEmail(docSnap.data().email || '');
                        const uTag = docSnap.data().userTag || '';
                        setCurrentUserTag(uTag);
                        
                        if (uTag && window.location.pathname.startsWith('/demo/') && !window.location.pathname.includes('/demo/profile') && !window.location.pathname.includes('/demo/preload')) {
                            const formattedTag = uTag.startsWith('@') ? uTag : '@' + uTag;
                            const newPath = window.location.pathname.replace('/demo/', `/${formattedTag}/`);
                            navigate(newPath, { replace: true });
                        }
                    }
                } catch (e) {
                    console.error("Error fetching demo user config", e);
                }
            }
        };
        fetchDemoUser();
    }, [authUid, navigate]);

    const handleSaveConfig = async () => {
        const demoUserId = authUid;
        if (!demoUserId) {
            alert('No se pudo identificar el usuario de la demo.');
            return;
        }

        try {
            const updates: any = {};
            if (configEmail.trim()) updates.email = configEmail.trim();
            if (configPassword.trim()) updates.customPassword = configPassword.trim();

            if (Object.keys(updates).length > 0) {
                await updateDoc(doc(db, 'users', demoUserId), updates);
                alert('Configuración guardada exitosamente');
                setConfigPassword(''); // Clear password field after saving
            } else {
                alert('No hay cambios para guardar.');
            }
            setIsConfigModalOpen(false);
        } catch (error) {
            console.error("Error saving config", error);
            alert('Error al guardar la configuración');
        }
    };

    useEffect(() => {
        const handleStatus = (e: any) => {
            const isFull = !e.detail;
            // When switching to turnosLlenos (was false, now true)
            if (isFull) {
                setAnimateHighlight(true);
                setTimeout(() => setAnimateHighlight(false), 3000); // glow for 3s
            }
            setTurnosLlenos(isFull);
        };
        window.addEventListener('agendaStatusChanged', handleStatus);
        
        const loadAvatar = () => {
            const saved = localStorage.getItem('demoArtistData');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    if (data.profilePhotoUrl) {
                        setAvatarUrl(data.profilePhotoUrl);
                    }
                } catch(e) {}
            }
        };
        window.addEventListener('profileDataChanged', loadAvatar);
        
        const saved = localStorage.getItem('demoArtistData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.isAvailable === false) {
                    setTurnosLlenos(true);
                }
                if (data.profilePhotoUrl) {
                    setAvatarUrl(data.profilePhotoUrl);
                }
            } catch(e) {}
        }
        return () => {
            window.removeEventListener('agendaStatusChanged', handleStatus);
            window.removeEventListener('profileDataChanged', loadAvatar);
        };
    }, []);

    

    const handleNav = (path: string) => {
        if (path === '/') {
            localStorage.clear(); // Clear all cached data
            import('../lib/cache').then((m) => {
                for (let key in m.globalPreloadCache) delete m.globalPreloadCache[key];
            });
            localStorage.removeItem('demoUserId'); import('../firebase').then(({ auth }) => auth.signOut()); navigate('/?login=true');
            return;
        }
        
        if (path.startsWith('/demo/') && path !== '/demo/profile' && path !== '/demo/preload' && currentUserTag) {
            const utag = currentUserTag.startsWith('@') ? currentUserTag : '@' + currentUserTag;
            path = path.replace('/demo/', '/' + utag + '/');
        }
        
        if (onNavigate) {
            onNavigate(path);
        } else {
            navigate(path);
        }
    };

    if (isAuthChecking) {
        return <div className="min-h-screen bg-deep-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    return (
        <div className="bg-deep-black text-silver-text font-body-md h-[100dvh] overflow-hidden flex text-[#e5e2e1] bg-[#050505]">
            {/* Common Styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #050505;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #054d44; border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #054d44;
                }
                input[type=range] {
                    -webkit-appearance: none;
                    width: 100%;
                    background: transparent;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background: #95d2c6;
                    cursor: pointer;
                    margin-top: -10px;
                }
                input[type=range]::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 6px;
                    cursor: pointer;
                    background: #353434;
                    border-radius: 3px;
                }
                input[type=range]:focus {
                    outline: none;
                }
                .glass-panel { background: rgba(20, 19, 19, 0.8); backdrop-filter: blur(12px); border: 1px solid #353434; }
                .emerald-focus { border-bottom: 1px solid #353434; }
                .emerald-focus:focus-within { border: 1px solid #054d44; }
            `}</style>

            {/* SideNavBar Desktop */}
            <nav className="hidden md:flex bg-surface dark:bg-surface-container-lowest h-screen w-64 fixed left-0 top-0 border-r border-border-muted flex-col py-8 px-6 z-50" style={{backgroundColor: '#131313', borderColor: '#353434'}}>
                <div className="mb-10">
                    <h1 className="font-display-lg text-on-surface uppercase tracking-tighter text-2xl mb-1">
                        Turnos <span className="text-emerald-accent" style={{color: '#054d44'}}>Tattoo</span>
                    </h1>
                    <p className="font-label-md text-on-surface-variant">Perfil del Artista</p>
                </div>
                
                <ul className="flex-grow space-y-2">
                    <li>
                        <a className={`flex items-center font-medium pl-4 transition-all duration-200 group py-2 active:scale-95 ${activeTab === 'dashboard' ? 'text-primary border-l-2 border-primary bg-surface-elevation/20 font-bold' : 'text-on-surface-variant hover:text-primary'}`} href="#" onClick={(e) => { e.preventDefault(); handleNav('/demo/dashboard'); }} style={activeTab === 'dashboard' ? {color: '#95d2c6', borderLeftColor: '#95d2c6'} : {}}>
                            <span className={`material-symbols-outlined mr-3 transition-colors ${activeTab === 'dashboard' ? 'text-primary fill' : 'text-on-surface-variant group-hover:text-primary'}`} style={activeTab === 'dashboard' ? {color: '#95d2c6'} : {}}>dashboard</span>
                            <span className="font-label-md">Panel</span>
                        </a>
                    </li>
                    <li>
                        <a className={`flex items-center font-medium pl-4 transition-all duration-200 group py-2 active:scale-95 ${activeTab === 'portfolio' ? 'text-primary border-l-2 border-primary bg-surface-elevation/20 font-bold' : 'text-on-surface-variant hover:text-primary'}`} href="#" onClick={(e) => { e.preventDefault(); handleNav('/demo/portfolio'); }} style={activeTab === 'portfolio' ? {color: '#95d2c6', borderLeftColor: '#95d2c6'} : {}}>
                            <span className={`material-symbols-outlined mr-3 transition-colors ${activeTab === 'portfolio' ? 'text-primary fill' : 'text-on-surface-variant group-hover:text-primary'}`} style={activeTab === 'portfolio' ? {color: '#95d2c6'} : {}}>photo_library</span>
                            <span className="font-label-md">Portafolio</span>
                        </a>
                    </li>
                    <li>
                        <a className={`relative flex items-center font-medium pl-4 transition-all duration-200 group py-2 active:scale-95 ${activeTab === 'schedule' ? 'text-primary border-l-2 border-primary bg-surface-elevation/20 font-bold' : 'text-on-surface-variant hover:text-primary'} ${animateHighlight ? 'animate-pulse-ring bg-primary/10' : ''}`} href="#" onClick={(e) => { e.preventDefault(); handleNav('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#95d2c6', borderLeftColor: '#95d2c6'} : {}}>
                            <div className="relative">
                                <span className={`material-symbols-outlined mr-3 transition-transform duration-300 ${activeTab === 'schedule' ? 'text-primary fill' : 'text-on-surface-variant group-hover:text-primary'} ${animateHighlight ? 'text-emerald-accent scale-125' : ''}`} style={activeTab === 'schedule' ? {color: '#95d2c6'} : {}}>calendar_today</span>
                                {turnosLlenos && waitlistCount > 0 && (
                                    <span className={`absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10 ${animateHighlight ? 'animate-button-pop' : ''}`} style={{backgroundColor: '#ffb4ab', color: '#690005'}}>
                                        {waitlistCount}
                                    </span>
                                )}
                            </div>
                            <span className="font-label-md">Agenda</span>
                        </a>
                    </li>
                    <li>
                        <a className={`flex items-center font-medium pl-4 transition-all duration-200 group py-2 active:scale-95 ${activeTab === 'metrics' ? 'text-primary border-l-2 border-primary bg-surface-elevation/20 font-bold' : 'text-on-surface-variant hover:text-primary'}`} href="#" onClick={(e) => { e.preventDefault(); handleNav('/demo/metrics'); }} style={activeTab === 'metrics' ? {color: '#95d2c6', borderLeftColor: '#95d2c6'} : {}}>
                            <span className={`material-symbols-outlined mr-3 transition-colors ${activeTab === 'metrics' ? 'text-primary fill' : 'text-on-surface-variant group-hover:text-primary'}`} style={activeTab === 'metrics' ? {color: '#95d2c6'} : {}}>analytics</span>
                            <span className="font-label-md">Métricas</span>
                        </a>
                    </li>
                    <li>
                        <a className="flex items-center text-on-surface-variant font-medium pl-4 hover:text-primary transition-all duration-200 group py-2 active:scale-95" href="#" onClick={(e) => { e.preventDefault(); setIsConfigModalOpen(true); }}>
                            <span className="material-symbols-outlined mr-3 text-on-surface-variant group-hover:text-primary transition-colors">settings</span>
                            <span className="font-label-md">Configuración</span>
                        </a>
                    </li>
                </ul>
                <div className="mt-auto border-t border-border-muted pt-6 space-y-2" style={{borderColor: '#353434'}}>
                    
                    <a className="flex items-center text-on-surface-variant font-medium pl-4 hover:text-primary transition-all duration-200 group py-2 active:scale-95" href="#" onClick={(e) => { e.preventDefault(); handleNav('/'); }}>
                        <span className="material-symbols-outlined mr-3">logout</span>
                        <span className="font-label-md">Cerrar sesión</span>
                    </a>
                </div>
            </nav>

            {/* TopAppBar Mobile */}
            <header className="md:hidden fixed top-0 w-full h-16 bg-surface-elevation/80 backdrop-blur-md border-b border-border-muted z-50 flex justify-between items-center px-4" style={{backgroundColor: 'rgba(20, 19, 19, 0.8)', borderColor: '#353434'}}>
                <h1 className="font-headline-md text-on-surface font-bold text-lg uppercase tracking-tighter">Turnos <span className="text-emerald-accent" style={{color: '#054d44'}}>Tattoo</span></h1>
                <div className="flex gap-3 items-center">
                    <button onClick={() => handleNav(currentUserTag ? '/' + (currentUserTag.startsWith('@') ? currentUserTag : '@' + currentUserTag) : '/demo/profile')} className="text-[10px] font-bold uppercase tracking-widest text-on-surface bg-surface-variant px-2 py-1.5 rounded hover:text-primary border border-outline-variant/30 transition-all mr-1">
                        Ver Perfil
                    </button>
                    <button className="text-on-surface-variant hover:text-primary transition-all active:scale-95" title="Cambiar estilo">
                        <span className="material-symbols-outlined text-[20px]">palette</span>
                    </button>
                    <button className="text-on-surface-variant hover:text-primary transition-all active:scale-95 relative" onClick={() => setIsNotificationsOpen(true)}>
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-error text-[8px] text-on-error font-bold z-10">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    <button className="text-on-surface-variant hover:text-primary transition-all active:scale-95" onClick={() => setIsMenuModalOpen(true)}>
                        <span className="material-symbols-outlined text-[20px]">menu</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="md:ml-64 flex-1 h-[100dvh] overflow-y-auto bg-deep-black pt-16 md:pt-0 pb-24 md:pb-12 custom-scrollbar" style={{backgroundColor: '#050505'}}>
                {/* TopAppBar Desktop */}
                <header className="hidden md:flex h-16 items-center px-8 bg-surface-elevation/80 backdrop-blur-md sticky top-0 z-40 border-b border-border-muted" style={{backgroundColor: 'rgba(20, 19, 19, 0.8)', borderColor: '#353434'}}>
                    <div className="flex-1"></div>
                    <div className="flex-shrink-0 flex items-center justify-center">
                        <button onClick={() => handleNav(currentUserTag ? '/' + (currentUserTag.startsWith('@') ? currentUserTag : '@' + currentUserTag) : '/demo/profile')} className="text-[10px] font-bold uppercase tracking-widest text-emerald-accent bg-surface-variant px-6 py-2 rounded-full hover:bg-emerald-accent/10 border border-emerald-accent transition-all shadow-[0_0_15px_rgba(5,77,68,0.2)]" style={{borderColor: '#054d44', color: '#054d44'}}>
                            Ver Perfil
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-end space-x-6">
                        <button className="text-on-surface-variant hover:text-primary transition-all active:scale-95" title="Cambiar estilo">
                            <span className="material-symbols-outlined">palette</span>
                        </button>
                        <button className="text-on-surface-variant hover:text-primary transition-all active:scale-95 relative" onClick={() => setIsNotificationsOpen(true)}>
                            <span className="material-symbols-outlined">notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10">
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                    </div>
                </header>

                <div className="px-4 md:px-8 pt-6 md:pt-8 max-w-container-max mx-auto">
                    {/* Page Header block (optional if titlePrefix is passed) */}
                    {titlePrefix && (
                        <div className="mb-6 border-b border-border-muted pb-4" style={{borderColor: '#353434'}}>
                            <h1 className="font-display-lg text-silver-text uppercase tracking-tighter text-3xl md:text-4xl" style={{color: '#e5e2e1'}}>
                                {titlePrefix} {titleAccent && <span className="text-emerald-accent" style={{color: '#054d44'}}>{titleAccent}</span>}
                            </h1>
                            {description && (
                                <p className="font-body-lg text-on-surface-variant mt-2 text-sm max-w-2xl" style={{color: '#bfc9c5'}}>
                                    {description}
                                </p>
                            )}
                        </div>
                    )}

                    {children}
                </div>
            </main>

            {/* BottomNavBar Mobile */}
            <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest border-t border-border-muted z-50 px-4 py-2 flex justify-around items-center pb-safe" style={{backgroundColor: '#0e0e0e', borderColor: '#353434'}}>
                <a className={`flex flex-col items-center p-2 active:scale-95 transition-transform ${activeTab === 'dashboard' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}`} href="#" onClick={(e) => { e.preventDefault(); handleNav('/demo/dashboard'); }} style={activeTab === 'dashboard' ? {color: '#054d44'} : {}}>
                    <span className={`material-symbols-outlined mb-1 ${activeTab === 'dashboard' ? 'fill' : ''}`} style={activeTab === 'dashboard' ? {color: '#054d44'} : {}}>dashboard</span>
                    <span className="font-label-sm text-[10px]">Inicio</span>
                </a>
                <a className={`flex flex-col items-center p-2 active:scale-95 transition-transform ${activeTab === 'portfolio' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}`} href="#" onClick={(e) => { e.preventDefault(); handleNav('/demo/portfolio'); }} style={activeTab === 'portfolio' ? {color: '#054d44'} : {}}>
                    <span className={`material-symbols-outlined mb-1 ${activeTab === 'portfolio' ? 'fill' : ''}`} style={activeTab === 'portfolio' ? {color: '#054d44'} : {}}>photo_library</span>
                    <span className="font-label-sm text-[10px]">Portafolio</span>
                </a>
                <a className={`flex flex-col items-center p-2 active:scale-95 transition-all duration-300 ${animateHighlight ? 'bg-primary/20 rounded-xl px-6 scale-110 shadow-[0_0_15px_rgba(5,77,68,0.5)]' : ''} ${activeTab === 'schedule' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}`} href="#" onClick={(e) => { e.preventDefault(); handleNav('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>
                    <div className="relative">
                        <span className={`material-symbols-outlined mb-1 transition-transform duration-300 ${activeTab === 'schedule' ? 'fill' : ''} ${animateHighlight ? 'text-emerald-accent scale-125' : ''}`} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>calendar_today</span>
                        {turnosLlenos && waitlistCount > 0 && (
                            <span className={`absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10 transition-transform duration-500 ${animateHighlight ? 'animate-button-pop scale-125' : ''}`} style={{backgroundColor: '#ffb4ab', color: '#690005'}}>
                                {waitlistCount}
                            </span>
                        )}
                    </div>
                    <span className={`font-label-sm text-[10px] transition-colors ${animateHighlight ? 'text-emerald-accent' : ''}`}>Agenda</span>
                </a>
                <a className={`flex flex-col items-center p-2 active:scale-95 transition-transform ${activeTab === 'metrics' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}`} href="#" onClick={(e) => { e.preventDefault(); handleNav('/demo/metrics'); }} style={activeTab === 'metrics' ? {color: '#054d44'} : {}}>
                    <span className={`material-symbols-outlined mb-1 ${activeTab === 'metrics' ? 'fill' : ''}`} style={activeTab === 'metrics' ? {color: '#054d44'} : {}}>analytics</span>
                    <span className="font-label-sm text-[10px]">Métricas</span>
                </a>
            </nav>

            {/* Menu Modal */}
            {isMenuModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-end bg-black/60 backdrop-blur-sm p-4 pt-16" onClick={() => setIsMenuModalOpen(false)}>
                    <div className="bg-surface-container w-56 rounded-lg border border-outline-variant/30 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="w-full px-4 py-4 text-left font-label-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors flex items-center gap-3 border-b border-outline-variant/30"
                            onClick={() => {
                                setIsMenuModalOpen(false);
                                setIsConfigModalOpen(true);
                            }}
                        >
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            Configuración personal
                        </button>
                        <button 
                            className="w-full px-4 py-4 text-left font-label-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors flex items-center gap-3"
                            onClick={() => {
                                setIsMenuModalOpen(false);
                                handleNav('/');
                            }}
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            )}

            {/* Config Modal */}
            {isConfigModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsConfigModalOpen(false)}>
                    <div className="bg-surface-container w-full max-w-sm rounded-2xl border border-outline-variant/30 p-6 shadow-2xl flex flex-col relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
                            onClick={() => setIsConfigModalOpen(false)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary" style={{backgroundColor: 'rgba(5, 77, 68, 0.2)', color: '#95d2c6'}}>
                                <span className="material-symbols-outlined">shield_person</span>
                            </div>
                            <h3 className="font-headline-md text-xl font-bold uppercase tracking-tighter">Seguridad</h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex flex-col gap-1">
                                <label className="font-label-sm text-[10px] text-secondary uppercase tracking-widest">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    value={configEmail}
                                    onChange={(e) => setConfigEmail(e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 text-sm text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors rounded"
                                />
                                <p className="text-[10px] text-on-surface-variant/70 mt-1 leading-tight">Este correo también servirá para ingresar a tu cuenta junto a tu usuario de siempre.</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-label-sm text-[10px] text-secondary uppercase tracking-widest">Nueva Contraseña</label>
                                <div className="relative">
                                    <input 
                                        type={showConfigPassword ? "text" : "password"} 
                                        value={configPassword}
                                        onChange={(e) => setConfigPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 pr-10 text-sm text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors rounded"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowConfigPassword(!showConfigPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-silver-text transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">
                                            {showConfigPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                                <p className="text-[10px] text-on-surface-variant/70 mt-1 leading-tight">Cambia tu contraseña por defecto para mayor seguridad.</p>
                            </div>
                        </div>

                        <button 
                            className="w-full py-3 bg-emerald-accent text-on-primary font-bold text-xs uppercase tracking-widest rounded hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(5,77,68,0.4)]"
                            style={{backgroundColor: '#054d44'}}
                            onClick={handleSaveConfig}
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            )}


            {/* Notifications Modal / Dropdown */}
            {isNotificationsOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-end bg-black/60 backdrop-blur-sm p-4 pt-16 md:pt-20 md:pr-8" onClick={() => setIsNotificationsOpen(false)}>
                    <div className="bg-surface-container w-full max-w-sm rounded-xl border border-outline-variant/30 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 flex flex-col max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
                            <h3 className="font-headline-md font-bold uppercase tracking-widest text-on-surface text-sm">Notificaciones</h3>
                            <button className="text-on-surface-variant hover:text-error" onClick={() => setIsNotificationsOpen(false)}>
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-on-surface-variant flex flex-col items-center gap-2">
                                    <span className="material-symbols-outlined text-4xl opacity-50">notifications_paused</span>
                                    <p className="text-sm">No tienes notificaciones</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif.id} 
                                            onClick={() => handleReadNotification(notif)}
                                            className={`p-3 rounded-lg cursor-pointer transition-colors border-l-2 ${!notif.read ? 'bg-primary/5 border-primary hover:bg-primary/10' : 'bg-transparent border-transparent hover:bg-surface-container-high'}`}
                                        >
                                            <div className="flex justify-between items-start gap-2 mb-1">
                                                <h4 className={`text-sm ${!notif.read ? 'font-bold text-on-surface' : 'text-on-surface-variant'} line-clamp-1`}>{notif.title}</h4>
                                                <span className="text-[10px] text-secondary whitespace-nowrap">
                                                    {notif.date?.toDate ? notif.date.toDate().toLocaleDateString() : 'Reciente'}
                                                </span>
                                            </div>
                                            <p className={`text-xs ${!notif.read ? 'text-on-surface-variant' : 'text-secondary'} line-clamp-2`}>{notif.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Detail Modal */}
            {selectedNotification && (
                <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedNotification(null)}>
                    <div className="bg-surface-container w-full max-w-md rounded-2xl border border-outline-variant/30 p-6 shadow-2xl flex flex-col relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
                            onClick={() => setSelectedNotification(null)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6 pr-8">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0" style={{backgroundColor: 'rgba(5, 77, 68, 0.2)', color: '#95d2c6'}}>
                                <span className="material-symbols-outlined">campaign</span>
                            </div>
                            <h3 className="font-headline-md text-lg font-bold text-on-surface">{selectedNotification.title}</h3>
                        </div>

                        <div className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap max-h-[50vh] overflow-y-auto custom-scrollbar pr-2 mb-6">
                            {selectedNotification.body}
                        </div>

                        <div className="flex justify-between items-center border-t border-outline-variant/20 pt-4 mt-auto">
                            <span className="text-xs text-secondary">
                                {selectedNotification.date?.toDate ? selectedNotification.date.toDate().toLocaleString() : ''}
                            </span>
                            <button 
                                className="px-4 py-2 bg-surface-variant text-on-surface-variant text-xs uppercase tracking-widest font-bold rounded hover:bg-surface-container-high transition-colors"
                                onClick={() => setSelectedNotification(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
