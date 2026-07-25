const fs = require('fs');

let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

const replacement = `import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from './DemoLayout';

export default function DemoMetrics() {
    const navigate = useNavigate();

    const [metrics, setMetrics] = useState({
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

    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

    return (
        <DemoLayout 
            activeTab="metrics"
            titlePrefix="Gestión de"
            titleAccent="Métricas"
            description="Rastrea tu rendimiento, visualiza interacciones y analiza el engagement."
        >
            <div className="flex flex-col gap-6">
                {/* KPI Summary Bento Grid */}
                <section className="grid gap-4 mb-8 grid-cols-2">
                    {/* Total Views */}
                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Vistas</h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>visibility</span>
                        </div>
                        <div>
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">
                                {formatNumber(metrics.views)}
                            </p>
                            <p className={\`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 \${animating ? 'scale-110 text-emerald-accent' : ''}\`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{calcIncrease(metrics.views, currentPeriod, 'views')}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={\`label-\${currentPeriod}\`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>

                    {/* Photo Clicks */}
                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Fotos</h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>touch_app</span>
                        </div>
                        <div>
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">
                                {formatNumber(metrics.photoClicks)}
                            </p>
                            <p className={\`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 \${animating ? 'scale-110 text-emerald-accent' : ''}\`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{calcIncrease(metrics.photoClicks, currentPeriod, 'photoClicks')}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={\`label-\${currentPeriod}\`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>

                    {/* WhatsApp Clicks */}
                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">WhatsApp</h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>chat</span>
                        </div>
                        <div>
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">
                                {formatNumber(metrics.whatsappClicks)}
                            </p>
                            <p className={\`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 \${animating ? 'scale-110 text-emerald-accent' : ''}\`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> 
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{calcIncrease(metrics.whatsappClicks, currentPeriod, 'whatsappClicks')}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={\`label-\${currentPeriod}\`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>

                    {/* Waiting List */}
                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style={{backgroundColor: '#141313', borderColor: '#353434'}}>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px]">Agenda</h3>
                            <span className="material-symbols-outlined text-primary-container text-[18px]" style={{color: '#054d44'}}>queue</span>
                        </div>
                        <div>
                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">
                                {formatNumber(metrics.agendaClicks)}
                            </p>
                            <p className={\`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-all duration-500 \${animating ? 'scale-110 text-emerald-accent' : ''}\`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span>
                                <span className="transition-all duration-500 animate-fade-in" key={currentPeriod}>{calcIncrease(metrics.agendaClicks, currentPeriod, 'agendaClicks')}</span>
                                <span className="text-[9px] text-on-surface-variant ml-1 transition-all duration-500 animate-fade-in" key={\`label-\${currentPeriod}\`}>{periodLabels[currentPeriod]}</span>
                            </p>
                        </div>
                    </div>`;

const searchRegex = /import React, { useState, useEffect } from 'react';[\s\S]*?(?=\{\/\* Conversion Rate \*\/\})/m;

content = content.replace(searchRegex, replacement + '\n\n                    ');
fs.writeFileSync('src/components/DemoMetrics.tsx', content);
