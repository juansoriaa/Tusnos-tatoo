const fs = require('fs');
let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

const oldMobileAgenda = `<a className={\`flex flex-col items-center p-2 active:scale-95 transition-transform \${activeTab === 'schedule' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>
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

const newMobileAgenda = `<a className={\`flex flex-col items-center p-2 active:scale-95 transition-all duration-300 \${animateHighlight ? 'bg-primary/20 rounded-xl px-6 scale-110 shadow-[0_0_15px_rgba(5,77,68,0.5)]' : ''} \${activeTab === 'schedule' ? 'text-emerald-accent font-bold' : 'text-on-surface-variant'}\`} href="#" onClick={(e) => { e.preventDefault(); navigate('/demo/waitlist'); }} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>
                    <div className="relative">
                        <span className={\`material-symbols-outlined mb-1 transition-transform duration-300 \${activeTab === 'schedule' ? 'fill' : ''} \${animateHighlight ? 'text-emerald-accent scale-125' : ''}\`} style={activeTab === 'schedule' ? {color: '#054d44'} : {}}>calendar_today</span>
                        {turnosLlenos && (
                            <span className={\`absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-error text-[10px] text-on-error font-bold z-10 transition-transform duration-500 \${animateHighlight ? 'animate-button-pop scale-125' : ''}\`} style={{backgroundColor: '#ffb4ab', color: '#690005'}}>
                                +3
                            </span>
                        )}
                    </div>
                    <span className={\`font-label-sm text-[10px] transition-colors \${animateHighlight ? 'text-emerald-accent' : ''}\`}>Agenda</span>
                </a>`;

content = content.replace(oldMobileAgenda, newMobileAgenda);
fs.writeFileSync('src/components/DemoLayout.tsx', content);
