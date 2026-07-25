const fs = require('fs');
let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

const targetFunction = `export default function DemoLayout({ children, activeTab, titlePrefix, titleAccent, description }: DemoLayoutProps) {
    const [turnosLlenos, setTurnosLlenos] = useState(false);
    useEffect(() => {
        const handleStatus = (e) => {
            setTurnosLlenos(!e.detail);
        };
        window.addEventListener('agendaStatusChanged', handleStatus);
        
        const saved = localStorage.getItem('demoArtistData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.isAvailable === false) {
                    setTurnosLlenos(true);
                }
            } catch(e) {}
        }
        return () => window.removeEventListener('agendaStatusChanged', handleStatus);
    }, []);`;

const replacementFunction = `export default function DemoLayout({ children, activeTab, titlePrefix, titleAccent, description }: DemoLayoutProps) {
    const [turnosLlenos, setTurnosLlenos] = useState(false);
    const [animateHighlight, setAnimateHighlight] = useState(false);

    useEffect(() => {
        const handleStatus = (e) => {
            const isFull = !e.detail;
            // When switching to turnosLlenos (was false, now true)
            if (isFull) {
                setAnimateHighlight(true);
                setTimeout(() => setAnimateHighlight(false), 3000); // glow for 3s
            }
            setTurnosLlenos(isFull);
        };
        window.addEventListener('agendaStatusChanged', handleStatus);
        
        const saved = localStorage.getItem('demoArtistData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.isAvailable === false) {
                    setTurnosLlenos(true);
                }
            } catch(e) {}
        }
        return () => window.removeEventListener('agendaStatusChanged', handleStatus);
    }, []);`;

content = content.replace(targetFunction, replacementFunction);

const oldDesktopAgenda = `<a className={\`flex items-center font-medium pl-4 transition-all duration-300 group py-2 active:scale-95 \${turnosLlenos ? 'bg-primary/10 border-l-4 border-emerald-accent animate-pulse-ring' : ''} \${activeTab === 'schedule' ? 'text-primary border-l-2 border-primary bg-surface-elevation/20 font-bold' : 'text-on-surface-variant hover:text-primary'}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#95d2c6', borderLeftColor: '#95d2c6'} : {}}>
                            <span className={\`material-symbols-outlined mr-3 transition-colors \${turnosLlenos ? 'text-emerald-accent' : ''} \${activeTab === 'schedule' ? 'text-primary fill' : 'text-on-surface-variant group-hover:text-primary'}\`} style={activeTab === 'schedule' ? {color: '#95d2c6'} : {}}>{turnosLlenos ? 'mark_email_unread' : 'calendar_today'}</span>
                            <span className="font-label-md">Agenda {turnosLlenos ? '(Nuevos)' : ''}</span>
                        </a>`;

const newDesktopAgenda = `<a className={\`relative flex items-center font-medium pl-4 transition-all duration-200 group py-2 active:scale-95 \${activeTab === 'schedule' ? 'text-primary border-l-2 border-primary bg-surface-elevation/20 font-bold' : 'text-on-surface-variant hover:text-primary'} \${animateHighlight ? 'animate-pulse-ring bg-primary/10' : ''}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#95d2c6', borderLeftColor: '#95d2c6'} : {}}>
                            <div className="relative">
                                <span className={\`material-symbols-outlined mr-3 transition-transform duration-300 \${activeTab === 'schedule' ? 'text-primary fill' : 'text-on-surface-variant group-hover:text-primary'} \${animateHighlight ? 'text-emerald-accent scale-125' : ''}\`} style={activeTab === 'schedule' ? {color: '#95d2c6'} : {}}>calendar_today</span>
                                {turnosLlenos && (
                                    <span className={\`absolute -top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10 \${animateHighlight ? 'animate-button-pop' : ''}\`} style={{backgroundColor: '#ffb4ab', color: '#690005'}}>
                                        3
                                    </span>
                                )}
                            </div>
                            <span className="font-label-md">Agenda</span>
                        </a>`;

content = content.replace(oldDesktopAgenda, newDesktopAgenda);

const oldMobileAgenda = `<a className={\`flex flex-col items-center p-2 active:scale-95 transition-all duration-300 \${turnosLlenos ? 'bg-primary/20 rounded-xl px-4 animate-subtle-glow border border-emerald-accent/50 text-emerald-accent' : ''} \${activeTab === 'schedule' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>
                    <span className={\`material-symbols-outlined mb-1 transition-all \${turnosLlenos ? 'scale-110' : ''} \${activeTab === 'schedule' ? 'fill' : ''}\`} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>{turnosLlenos ? 'mark_email_unread' : 'calendar_today'}</span>
                    <span className="font-label-sm text-[10px]">Agenda {turnosLlenos ? '(Nuevos)' : ''}</span>
                </a>`;

const newMobileAgenda = `<a className={\`flex flex-col items-center p-2 active:scale-95 transition-transform \${activeTab === 'schedule' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>
                    <div className="relative">
                        <span className={\`material-symbols-outlined mb-1 transition-transform duration-300 \${activeTab === 'schedule' ? 'fill' : ''} \${animateHighlight ? 'text-emerald-accent scale-150 animate-subtle-glow' : ''}\`} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>calendar_today</span>
                        {turnosLlenos && (
                            <span className={\`absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10 \${animateHighlight ? 'animate-button-pop' : ''}\`} style={{backgroundColor: '#ffb4ab', color: '#690005'}}>
                                3
                            </span>
                        )}
                    </div>
                    <span className="font-label-sm text-[10px]">Agenda</span>
                </a>`;

content = content.replace(oldMobileAgenda, newMobileAgenda);

fs.writeFileSync('src/components/DemoLayout.tsx', content);
