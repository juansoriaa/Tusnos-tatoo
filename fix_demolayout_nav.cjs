const fs = require('fs');
let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

// We need to add state for turnosLlenos
const importReact = `import React, { useState, useEffect } from 'react';`;
content = content.replace(`import React from 'react';`, importReact);

// Find the DemoLayout function signature and insert the state
const functionStart = `export default function DemoLayout({ children, activeTab, titlePrefix, titleAccent, description }: DemoLayoutProps) {`;
const stateCode = `    const [turnosLlenos, setTurnosLlenos] = useState(false);
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
    }, []);
`;
content = content.replace(functionStart, functionStart + '\n' + stateCode);

// Modify the desktop Agenda link
const oldDesktopAgenda = `<a className={\`flex items-center font-medium pl-4 transition-all duration-200 group py-2 active:scale-95 \${activeTab === 'schedule' ? 'text-primary border-l-2 border-primary bg-surface-elevation/20 font-bold' : 'text-on-surface-variant hover:text-primary'}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#95d2c6', borderLeftColor: '#95d2c6'} : {}}>
                            <span className={\`material-symbols-outlined mr-3 transition-colors \${activeTab === 'schedule' ? 'text-primary fill' : 'text-on-surface-variant group-hover:text-primary'}\`} style={activeTab === 'schedule' ? {color: '#95d2c6'} : {}}>calendar_today</span>
                            <span className="font-label-md">Agenda</span>
                        </a>`;

const newDesktopAgenda = `<a className={\`flex items-center font-medium pl-4 transition-all duration-300 group py-2 active:scale-95 \${turnosLlenos ? 'bg-primary/10 border-l-4 border-emerald-accent animate-pulse-ring' : ''} \${activeTab === 'schedule' ? 'text-primary border-l-2 border-primary bg-surface-elevation/20 font-bold' : 'text-on-surface-variant hover:text-primary'}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#95d2c6', borderLeftColor: '#95d2c6'} : {}}>
                            <span className={\`material-symbols-outlined mr-3 transition-colors \${turnosLlenos ? 'text-emerald-accent' : ''} \${activeTab === 'schedule' ? 'text-primary fill' : 'text-on-surface-variant group-hover:text-primary'}\`} style={activeTab === 'schedule' ? {color: '#95d2c6'} : {}}>\${turnosLlenos ? 'mark_email_unread' : 'calendar_today'}</span>
                            <span className="font-label-md">Agenda \${turnosLlenos ? '(Nuevos)' : ''}</span>
                        </a>`;

content = content.replace(oldDesktopAgenda, newDesktopAgenda);

// Modify the mobile Agenda link
const oldMobileAgenda = `<a className={\`flex flex-col items-center p-2 active:scale-95 transition-transform \${activeTab === 'schedule' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>
                    <span className={\`material-symbols-outlined mb-1 \${activeTab === 'schedule' ? 'fill' : ''}\`} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>calendar_today</span>
                    <span className="font-label-sm text-[10px]">Agenda</span>
                </a>`;

const newMobileAgenda = `<a className={\`flex flex-col items-center p-2 active:scale-95 transition-all duration-300 \${turnosLlenos ? 'bg-primary/20 rounded-xl px-4 animate-subtle-glow border border-emerald-accent/50 text-emerald-accent' : ''} \${activeTab === 'schedule' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>
                    <span className={\`material-symbols-outlined mb-1 transition-all \${turnosLlenos ? 'scale-110' : ''} \${activeTab === 'schedule' ? 'fill' : ''}\`} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>\${turnosLlenos ? 'mark_email_unread' : 'calendar_today'}</span>
                    <span className="font-label-sm text-[10px]">Agenda \${turnosLlenos ? '(Nuevos)' : ''}</span>
                </a>`;

content = content.replace(oldMobileAgenda, newMobileAgenda);

fs.writeFileSync('src/components/DemoLayout.tsx', content);
