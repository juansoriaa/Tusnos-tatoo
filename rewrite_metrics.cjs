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

    const baseMetrics = {
        views: 11025,
        photoClicks: 1140,
        whatsappClicks: 790,
        agendaClicks: 40
    };

    const calcIncrease = (current, base) => {
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
                            <p className={\`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-transform duration-500 \${animating ? 'scale-110 text-emerald-accent' : ''}\`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> {calcIncrease(metrics.views, baseMetrics.views)}
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
                            <p className={\`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-transform duration-500 \${animating ? 'scale-110 text-emerald-accent' : ''}\`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> {calcIncrease(metrics.photoClicks, baseMetrics.photoClicks)}
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
                            <p className={\`font-caption text-caption text-primary flex items-center gap-1 mt-0.5 text-[12px] transition-transform duration-500 \${animating ? 'scale-110 text-emerald-accent' : ''}\`} style={{color: '#95d2c6'}}>
                                <span className="material-symbols-outlined text-[12px]">arrow_upward</span> {calcIncrease(metrics.whatsappClicks, baseMetrics.whatsappClicks)}
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
                            <p className={\`font-caption text-caption text-on-surface-variant flex items-center gap-1 mt-0.5 text-[12px] transition-transform duration-500 \${animating ? 'scale-110 text-emerald-accent' : ''}\`}>
                                Pendientes
                            </p>
                        </div>
                    </div>`;
                    
content = content.replace(/import React from 'react';\nimport \{ useNavigate \} from 'react-router-dom';\nimport DemoLayout from '\.\/DemoLayout';\n\nexport default function DemoMetrics\(\) \{\n    const navigate = useNavigate\(\);\n\n    return \(\n        <DemoLayout \n            activeTab="metrics"\n            titlePrefix="Gestión de"\n            titleAccent="Métricas"\n            description="Rastrea tu rendimiento, visualiza interacciones y analiza el engagement."\n        >\n            <div className="flex flex-col gap-6">\n                \{\/\* KPI Summary Bento Grid \*\/\}\n                <section className="grid gap-4 mb-8 grid-cols-2">\n                    \{\/\* Total Views \*\/\}\n                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style=\{\{backgroundColor: '#141313', borderColor: '#353434'\}\}>\n                        <div className="flex justify-between items-start mb-2">\n                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-\[10px\]">Vistas<\/h3>\n                            <span className="material-symbols-outlined text-primary-container text-\[18px\]" style=\{\{color: '#054d44'\}\}>visibility<\/span>\n                        <\/div>\n                        <div>\n                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">14,209<\/p>\n                            <p className="font-caption text-caption text-primary flex items-center gap-1 mt-0\.5 text-\[12px\]" style=\{\{color: '#95d2c6'\}\}>\n                                <span className="material-symbols-outlined text-\[12px\]">arrow_upward<\/span> \+12\.5%\n                            <\/p>\n                        <\/div>\n                    <\/div>\n\n                    \{\/\* Photo Clicks \*\/\}\n                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style=\{\{backgroundColor: '#141313', borderColor: '#353434'\}\}>\n                        <div className="flex justify-between items-start mb-2">\n                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-\[10px\]">Fotos<\/h3>\n                            <span className="material-symbols-outlined text-primary-container text-\[18px\]" style=\{\{color: '#054d44'\}\}>touch_app<\/span>\n                        <\/div>\n                        <div>\n                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">3,842<\/p>\n                            <p className="font-caption text-caption text-primary flex items-center gap-1 mt-0\.5 text-\[12px\]" style=\{\{color: '#95d2c6'\}\}>\n                                <span className="material-symbols-outlined text-\[12px\]">arrow_upward<\/span> \+5\.2%\n                            <\/p>\n                        <\/div>\n                    <\/div>\n\n                    \{\/\* WhatsApp Clicks \*\/\}\n                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style=\{\{backgroundColor: '#141313', borderColor: '#353434'\}\}>\n                        <div className="flex justify-between items-start mb-2">\n                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-\[10px\]">WhatsApp<\/h3>\n                            <span className="material-symbols-outlined text-primary-container text-\[18px\]" style=\{\{color: '#054d44'\}\}>chat<\/span>\n                        <\/div>\n                        <div>\n                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">856<\/p>\n                            <p className="font-caption text-caption text-primary flex items-center gap-1 mt-0\.5 text-\[12px\]" style=\{\{color: '#95d2c6'\}\}>\n                                <span className="material-symbols-outlined text-\[12px\]">arrow_upward<\/span> \+8\.1%\n                            <\/p>\n                        <\/div>\n                    <\/div>\n\n                    \{\/\* Waiting List \*\/\}\n                    <div className="bg-surface-elevation border border-border-muted p-3 flex flex-col justify-between hover:border-primary-container transition-colors duration-300" style=\{\{backgroundColor: '#141313', borderColor: '#353434'\}\}>\n                        <div className="flex justify-between items-start mb-2">\n                            <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-\[10px\]">Espera<\/h3>\n                            <span className="material-symbols-outlined text-primary-container text-\[18px\]" style=\{\{color: '#054d44'\}\}>queue<\/span>\n                        <\/div>\n                        <div>\n                            <p className="font-headline-md text-headline-md text-silver-text text-2xl font-bold">128<\/p>\n                            <p className="font-caption text-caption text-on-surface-variant flex items-center gap-1 mt-0\.5 text-\[12px\]">\n                                Pendientes\n                            <\/p>\n                        <\/div>\n                    <\/div>/, replacement);

fs.writeFileSync('src/components/DemoMetrics.tsx', content);
