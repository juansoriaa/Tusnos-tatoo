const fs = require('fs');
let code = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

if (!code.includes('const [waitlistMessages')) {
    code = code.replace(
        /const \[workModalOpen, setWorkModalOpen\] = useState\(false\);/,
        `const [workModalOpen, setWorkModalOpen] = useState(false);\n    const [waitlistMessages, setWaitlistMessages] = useState<any[]>([]);\n    \n    React.useEffect(() => {\n        const load = () => {\n            try {\n                const saved = localStorage.getItem('demoWaitlistMessages');\n                if (saved) setWaitlistMessages(JSON.parse(saved));\n            } catch(e) {}\n        };\n        load();\n        window.addEventListener('newWaitlistMessage', load);\n        return () => window.removeEventListener('newWaitlistMessage', load);\n    }, []);`
    );
}

// Replace the <article> blocks with dynamic rendering + existing hardcoded
const originalArticlesStr = `<article className="glass-panel p-4 md:p-6 cursor-pointer hover:border-emerald-accent transition-all duration-300 group neon-border"  onClick={() => openMessageModal({ name: 'Alex M.', time: 'Hace 2 horas', title: 'Consulta de Cover-up', text: 'Tengo un tatuaje antiguo en mi antebrazo que quiero cubrir con algo botánico. Específicamente buscando peonías y helechos en blackwork. ¿Es posible? Tengo imágenes de referencia.', hasImage: true, type: 'Nueva solicitud', typeClass: 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-border-muted whitespace-nowrap' })}>                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">                            <div className="flex items-center gap-4">                                <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-variant border border-border-muted rounded-full flex items-center justify-center font-headline-md text-silver-text" style={{borderColor: '#353434'}}>A</div>                                <div>                                    <h3 className="font-headline-md text-headline-sm text-silver-text group-hover:text-emerald-accent transition-colors" style={{color: '#e5e2e1'}}>Alex M.</h3>                                    <p className="font-body-md text-label-sm text-on-surface-variant">Hace 2 horas</p>                                </div>                            </div>                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-border-muted whitespace-nowrap">Nueva solicitud</span>                        </div>                        <h4 className="font-headline-md text-headline-sm text-silver-text mb-2">Consulta de Cover-up</h4>                        <p className="font-body-md text-body-sm text-on-surface-variant line-clamp-2 md:line-clamp-none">Tengo un tatuaje antiguo en mi antebrazo que quiero cubrir con algo botánico...</p>                    </article>                    <article className="glass-panel p-4 md:p-6 cursor-pointer hover:border-emerald-accent transition-all duration-300 group neon-border opacity-75"  onClick={() => openMessageModal({ name: 'Sarah L.', time: 'Ayer', title: 'Confirmación de turno para el viernes', text: 'Solo para confirmar nuestra cita para el viernes a las 2PM para la pieza tradicional. ¿Necesito hacer algo específico para prepararme?', hasImage: false, type: 'Programado', typeClass: 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-accent border border-emerald-accent/30 whitespace-nowrap' })}>                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">                            <div className="flex items-center gap-4">                                <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-variant border border-border-muted rounded-full flex items-center justify-center font-headline-md text-silver-text" style={{borderColor: '#353434'}}>S</div>                                <div>                                    <h3 className="font-headline-md text-headline-sm text-silver-text group-hover:text-emerald-accent transition-colors" style={{color: '#e5e2e1'}}>Sarah L.</h3>                                    <p className="font-body-md text-label-sm text-on-surface-variant">Ayer</p>                                </div>                            </div>                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-accent border border-emerald-accent/30 whitespace-nowrap">Programado</span>                        </div>                        <h4 className="font-headline-md text-headline-sm text-silver-text mb-2">Confirmación de turno para el viernes</h4>                        <p className="font-body-md text-body-sm text-on-surface-variant line-clamp-2 md:line-clamp-none">Solo para confirmar nuestra cita para el viernes a las 2PM para la pieza tradicional...</p>                    </article>`;
// wait, matching that large block with all spaces is tricky. Let's do a substring replace.
// We can find `<div className="flex flex-col gap-4">`
const searchTarget = `<div className="flex flex-col gap-4">`;

if (code.includes(searchTarget)) {
    const dynamicRender = `
                    {waitlistMessages.map((msg, idx) => (
                        <article key={idx} className="glass-panel p-4 md:p-6 cursor-pointer hover:border-emerald-accent transition-all duration-300 group neon-border" onClick={() => openMessageModal(msg)}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-surface-variant border border-border-muted rounded-full flex items-center justify-center font-headline-md text-silver-text" style={{borderColor: '#353434'}}>
                                        {msg.name ? msg.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div>
                                        <h3 className="font-headline-md text-headline-sm text-silver-text group-hover:text-emerald-accent transition-colors" style={{color: '#e5e2e1'}}>{msg.name}</h3>
                                        <p className="font-body-md text-label-sm text-on-surface-variant">{msg.time}</p>
                                    </div>
                                </div>
                                <span className={msg.typeClass || "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-border-muted whitespace-nowrap"}>{msg.type}</span>
                            </div>
                            <h4 className="font-headline-md text-headline-sm text-silver-text mb-2">{msg.title}</h4>
                            <p className="font-body-md text-body-sm text-on-surface-variant line-clamp-2 md:line-clamp-none">{msg.text}</p>
                        </article>
                    ))}
    `;
    code = code.replace(searchTarget, searchTarget + dynamicRender);
}

fs.writeFileSync('src/components/DemoWaitlist.tsx', code);
