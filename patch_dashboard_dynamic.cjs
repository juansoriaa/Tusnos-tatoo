const fs = require('fs');

let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const replacementState = `    const [metrics, setMetrics] = useState({
        views: 12400,
        photoClicks: 1200,
        whatsappClicks: 856,
        agendaClicks: 48
    });

    const [animating, setAnimating] = useState(false);
    const [periodIndex, setPeriodIndex] = useState(0);
    const periods = ['day', 'week', 'month'];
    const periodLabels = { day: 'Hoy', week: 'Esta sem', month: 'Este mes' };
        
    useEffect(() => {
        const loadMetrics = () => {
            try {
                const stored = localStorage.getItem('demoMetricsData');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    setMetrics(prev => {
                        if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
                            setAnimating(true);
                            setTimeout(() => setAnimating(false), 1000);
                        }
                        return parsed;
                    });
                }
            } catch (e) {}
        };
        loadMetrics();
        window.addEventListener('demoMetricsUpdated', loadMetrics);
        return () => window.removeEventListener('demoMetricsUpdated', loadMetrics);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setPeriodIndex(prev => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const currentPeriod = periods[periodIndex];

    const baseMetrics = {
        views: { day: 12200, week: 11025, month: 9500 },
        photoClicks: { day: 1180, week: 1140, month: 850 },
        whatsappClicks: { day: 830, week: 790, month: 520 },
        agendaClicks: { day: 45, week: 40, month: 25 }
    };

    const calcIncrease = (current, periodKey, metricName) => {
        const base = baseMetrics[metricName][periodKey];
        if (current <= base) return '0.0%';
        return '+' + (((current - base) / base) * 100).toFixed(1) + '%';
    };
    
    const formatNumber = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };`;

const searchStateRegex = /    const \[metrics, setMetrics\] = useState\(\{[\s\S]*?const formatNumber = \(num\) => \{[\s\S]*?return num\.toString\(\);\n    \};/m;

content = content.replace(searchStateRegex, replacementState);

const oldGrid = `<section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary overflow-hidden relative group">
                            <div className="flex justify-between items-start relative z-10">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>visibility</span>
                                <span className="text-[10px] font-bold text-primary flex items-center transition-transform group-hover:scale-110" style={{color: '#054d44'}}>
                                    {calcIncrease(metrics.views, baseMetrics.views)}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">{formatNumber(metrics.views)}</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">Vistas</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary overflow-hidden relative group">
                            <div className="flex justify-between items-start relative z-10">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>touch_app</span>
                                <span className="text-[10px] font-bold text-primary flex items-center transition-transform group-hover:scale-110" style={{color: '#054d44'}}>
                                    {calcIncrease(metrics.photoClicks, baseMetrics.photoClicks)}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">{formatNumber(metrics.photoClicks)}</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">Fotos</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary overflow-hidden relative group">
                            <div className="flex justify-between items-start relative z-10">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>chat</span>
                                <span className="text-[10px] font-bold text-primary flex items-center transition-transform group-hover:scale-110" style={{color: '#054d44'}}>
                                    {calcIncrease(metrics.whatsappClicks, baseMetrics.whatsappClicks)}
                                </span>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">{formatNumber(metrics.whatsappClicks)}</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">WhatsApp</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary overflow-hidden relative group">
                            <div className="flex justify-between items-start relative z-10">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>queue</span>
                                <span className="text-[10px] font-bold text-primary" style={{color: '#054d44'}}>
                                    Active
                                </span>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">{formatNumber(metrics.agendaClicks)}</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">Agenda</p>
                            </div>
                        </div>
                    </section>`;

const newGrid = `<section className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary overflow-hidden relative group">
                            <div className="flex justify-between items-start relative z-10">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>visibility</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-primary flex items-center transition-all duration-500 animate-fade-in" style={{color: '#054d44'}} key={currentPeriod}>
                                        {calcIncrease(metrics.views, currentPeriod, 'views')}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-wider text-on-surface-variant/60 transition-all duration-500 animate-fade-in" key={\`label-\${currentPeriod}\`}>
                                        {periodLabels[currentPeriod]}
                                    </span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">{formatNumber(metrics.views)}</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">Vistas</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary overflow-hidden relative group">
                            <div className="flex justify-between items-start relative z-10">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>touch_app</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-primary flex items-center transition-all duration-500 animate-fade-in" style={{color: '#054d44'}} key={currentPeriod}>
                                        {calcIncrease(metrics.photoClicks, currentPeriod, 'photoClicks')}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-wider text-on-surface-variant/60 transition-all duration-500 animate-fade-in" key={\`label-\${currentPeriod}\`}>
                                        {periodLabels[currentPeriod]}
                                    </span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">{formatNumber(metrics.photoClicks)}</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">Fotos</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary overflow-hidden relative group">
                            <div className="flex justify-between items-start relative z-10">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>chat</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-primary flex items-center transition-all duration-500 animate-fade-in" style={{color: '#054d44'}} key={currentPeriod}>
                                        {calcIncrease(metrics.whatsappClicks, currentPeriod, 'whatsappClicks')}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-wider text-on-surface-variant/60 transition-all duration-500 animate-fade-in" key={\`label-\${currentPeriod}\`}>
                                        {periodLabels[currentPeriod]}
                                    </span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">{formatNumber(metrics.whatsappClicks)}</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">WhatsApp</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary overflow-hidden relative group">
                            <div className="flex justify-between items-start relative z-10">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>queue</span>
                                <div className="flex items-center gap-1">
                                    <span className="text-[10px] font-bold text-primary flex items-center transition-all duration-500 animate-fade-in" style={{color: '#054d44'}} key={currentPeriod}>
                                        {calcIncrease(metrics.agendaClicks, currentPeriod, 'agendaClicks')}
                                    </span>
                                    <span className="text-[8px] uppercase tracking-wider text-on-surface-variant/60 transition-all duration-500 animate-fade-in" key={\`label-\${currentPeriod}\`}>
                                        {periodLabels[currentPeriod]}
                                    </span>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">{formatNumber(metrics.agendaClicks)}</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">Agenda</p>
                            </div>
                        </div>
                    </section>`;

content = content.replace(oldGrid, newGrid);
fs.writeFileSync('src/components/DemoDashboard.tsx', content);
