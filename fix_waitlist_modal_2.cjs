const fs = require('fs');
let content = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

const oldModalContent = `                    <div className="p-6 border-t border-border-muted bg-surface-container shrink-0" style={{borderColor: '#353434'}}>
                        <div className="flex flex-col gap-2">
                            <h3 className="font-headline-md text-silver-text mb-0">
                                {workModalData?.title || 'Referencia Adjuntada'}
                            </h3>
                            {workModalData?.tags?.includes('Refe. del portafolio') && (
                                <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20 rounded">
                                    Referencia del portafolio
                                </span>
                            )}
                            {workModalData?.tags?.includes('Refe. del usuario') && (
                                <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-outline-variant/50 rounded">
                                    Referencia subida
                                </span>
                            )}
                            {!workModalData?.tags?.includes('Refe. del portafolio') && !workModalData?.tags?.includes('Refe. del usuario') && (
                                <p className="font-body-md text-on-surface-variant">Pieza de referencia para el turno</p>
                            )}
                        </div>
                    </div>`;

const newModalContent = `                    <div className="p-6 border-t border-border-muted bg-surface-container shrink-0" style={{borderColor: '#353434'}}>
                        <div className="flex flex-col gap-2">
                            {workModalData?.title && workModalData?.title !== 'Imagen adjuntada' && (
                                <h3 className="font-headline-md text-silver-text mb-0">
                                    {workModalData.title}
                                </h3>
                            )}
                            <div className="flex flex-wrap gap-2 mt-1">
                                {workModalData?.tags?.includes('Consulta') && (
                                    <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-outline-variant/50 rounded">
                                        Consulta
                                    </span>
                                )}
                                {workModalData?.tags?.includes('Idea') && (
                                    <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-outline-variant/50 rounded">
                                        Idea
                                    </span>
                                )}
                                {workModalData?.tags?.includes('Refe. del portafolio') && (
                                    <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20 rounded">
                                        Referencia del portafolio
                                    </span>
                                )}
                                {workModalData?.tags?.includes('Refe. del usuario') && (
                                    <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-outline-variant/50 rounded">
                                        Referencia subida
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>`;
                    
content = content.replace(oldModalContent, newModalContent);
fs.writeFileSync('src/components/DemoWaitlist.tsx', content);
