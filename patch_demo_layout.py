import re

with open('src/components/DemoLayout.tsx', 'r') as f:
    content = f.read()

# Fix Firestore imports
if "onSnapshot" not in content:
    content = content.replace("import { doc, getDoc, updateDoc } from 'firebase/firestore';", "import { doc, getDoc, updateDoc, collection, query, orderBy, onSnapshot } from 'firebase/firestore';")

# Add Notification States
state_regex = r"const \[configPassword, setConfigPassword\] = useState\(''\);"
state_replacement = """const [configPassword, setConfigPassword] = useState('');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<any>(null);"""
content = re.sub(state_regex, state_replacement, content)

# Add useEffect for listening to notifications
useEffect_regex = r"useEffect\(\(\) => \{\n        const fetchDemoUser"
useEffect_replacement = """useEffect(() => {
        const demoUserId = localStorage.getItem('demoUserId');
        if (demoUserId) {
            const q = query(collection(db, 'users', demoUserId, 'notifications'), orderBy('date', 'desc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const notifs: any[] = [];
                snapshot.forEach((doc) => {
                    notifs.push({ id: doc.id, ...doc.data() });
                });
                setNotifications(notifs);
            });
            return () => unsubscribe();
        }
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleReadNotification = async (notif: any) => {
        setSelectedNotification(notif);
        if (!notif.read) {
            const demoUserId = localStorage.getItem('demoUserId');
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
        const fetchDemoUser"""
content = re.sub(useEffect_regex, useEffect_replacement, content)

# Add onclick to notification bells
# Mobile
bell1_regex = r"<button className=\"text-on-surface-variant hover:text-primary transition-all active:scale-95\">\s*<span className=\"material-symbols-outlined text-\[20px\]\">notifications</span>\s*</button>"
bell1_replacement = """<button className="text-on-surface-variant hover:text-primary transition-all active:scale-95 relative" onClick={() => setIsNotificationsOpen(true)}>
                        <span className="material-symbols-outlined text-[20px]">notifications</span>
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-error text-[8px] text-on-error font-bold z-10">
                                {unreadCount}
                            </span>
                        )}
                    </button>"""
content = re.sub(bell1_regex, bell1_replacement, content)

# Desktop
bell2_regex = r"<button className=\"text-on-surface-variant hover:text-primary transition-all active:scale-95\">\s*<span className=\"material-symbols-outlined\">notifications</span>\s*</button>"
bell2_replacement = """<button className="text-on-surface-variant hover:text-primary transition-all active:scale-95 relative" onClick={() => setIsNotificationsOpen(true)}>
                            <span className="material-symbols-outlined">notifications</span>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10">
                                    {unreadCount}
                                </span>
                            )}
                        </button>"""
content = re.sub(bell2_regex, bell2_replacement, content)


# Add Modals
modals_code = """
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
"""

content = content.replace("        </div>\n    );\n}", modals_code + "\n        </div>\n    );\n}")

with open('src/components/DemoLayout.tsx', 'w') as f:
    f.write(content)

