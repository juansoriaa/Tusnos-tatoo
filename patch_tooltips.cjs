const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

code = code.replace(
    /<h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-\[10px\]">Agenda<\/h3>/,
    `<h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] flex items-center gap-1">
                                Agenda
                                <div className="group relative inline-block">
                                    <span className="material-symbols-outlined text-[12px] text-on-surface-variant/50 hover:text-on-surface-variant cursor-help transition-colors">info</span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-surface-container-high border border-border-muted text-[10px] text-silver-text rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-center leading-tight normal-case font-normal" style={{backgroundColor: '#232222', borderColor: '#353434'}}>
                                        Usuarios que se agendaron exitosamente cuando la lista estaba llena.
                                    </div>
                                </div>
                            </h3>`
);

code = code.replace(
    /<h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-\[10px\]">Tasa Conversión<\/h3>/,
    `<h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest text-[10px] flex items-center gap-1">
                                Tasa Conversión
                                <div className="group relative inline-block">
                                    <span className="material-symbols-outlined text-[12px] text-on-surface-variant/50 hover:text-on-surface-variant cursor-help transition-colors">info</span>
                                    <div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-surface-container-high border border-border-muted text-[10px] text-silver-text rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-left leading-tight normal-case font-normal" style={{backgroundColor: '#232222', borderColor: '#353434'}}>
                                        Porcentaje de visitas al perfil que concretaron contacto por WhatsApp o enviaron solicitud por Lista de Espera.
                                    </div>
                                </div>
                            </h3>`
);

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
