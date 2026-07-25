const fs = require('fs');
let content = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

const oldState = `const [workModalImage, setWorkModalImage] = useState<string | null>(null);`;
const newState = `const [workModalData, setWorkModalData] = useState<any>(null);`;
content = content.replace(oldState, newState);

const oldBtn1 = `onClick={(e) => { e.stopPropagation(); setWorkModalImage(msg.referenceImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB9cjXc-As57VUHLLRBIMkJtdx3Mu3BvAB-nv6KxdzbgBimAv2sqkhAJHSDirz4qABVkR5VZHI4Yw7SYGnmPw9zw9Cxqqd385s0tZKAkdqeoHTuuif-cJ-vjyBGS_W_4mZT2v1uFrEsmZ5EgpgkA3wmO9gocTils0LCGmd10kapZocERnjdvoGl3pFvAgJ_-nyUHIhxIys8RggDiwSODk6IMwtiuzaZQQz4ut0AE4kWdygyqTVFdgjz3OIj3xnAGcsGvmtd9rot4gYe"); }}>`;
const newBtn1 = `onClick={(e) => { e.stopPropagation(); setWorkModalData({ image: msg.referenceImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB9cjXc-As57VUHLLRBIMkJtdx3Mu3BvAB-nv6KxdzbgBimAv2sqkhAJHSDirz4qABVkR5VZHI4Yw7SYGnmPw9zw9Cxqqd385s0tZKAkdqeoHTuuif-cJ-vjyBGS_W_4mZT2v1uFrEsmZ5EgpgkA3wmO9gocTils0LCGmd10kapZocERnjdvoGl3pFvAgJ_-nyUHIhxIys8RggDiwSODk6IMwtiuzaZQQz4ut0AE4kWdygyqTVFdgjz3OIj3xnAGcsGvmtd9rot4gYe", title: msg.referenceTitle, tags: msg.tags }); }}>`;
content = content.replace(oldBtn1, newBtn1);

const oldBtn2 = `onClick={() => setWorkModalImage(selectedMessage.referenceImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB9cjXc-As57VUHLLRBIMkJtdx3Mu3BvAB-nv6KxdzbgBimAv2sqkhAJHSDirz4qABVkR5VZHI4Yw7SYGnmPw9zw9Cxqqd385s0tZKAkdqeoHTuuif-cJ-vjyBGS_W_4mZT2v1uFrEsmZ5EgpgkA3wmO9gocTils0LCGmd10kapZocERnjdvoGl3pFvAgJ_-nyUHIhxIys8RggDiwSODk6IMwtiuzaZQQz4ut0AE4kWdygyqTVFdgjz3OIj3xnAGcsGvmtd9rot4gYe")}>`;
const newBtn2 = `onClick={() => setWorkModalData({ image: selectedMessage.referenceImage || "https://lh3.googleusercontent.com/aida-public/AB6AXuB9cjXc-As57VUHLLRBIMkJtdx3Mu3BvAB-nv6KxdzbgBimAv2sqkhAJHSDirz4qABVkR5VZHI4Yw7SYGnmPw9zw9Cxqqd385s0tZKAkdqeoHTuuif-cJ-vjyBGS_W_4mZT2v1uFrEsmZ5EgpgkA3wmO9gocTils0LCGmd10kapZocERnjdvoGl3pFvAgJ_-nyUHIhxIys8RggDiwSODk6IMwtiuzaZQQz4ut0AE4kWdygyqTVFdgjz3OIj3xnAGcsGvmtd9rot4gYe", title: selectedMessage.referenceTitle, tags: selectedMessage.tags })}>`;
content = content.replace(oldBtn2, newBtn2);

const oldModal = `{/* Work Modal */}
            <div className={\`fixed inset-0 bg-black/95 backdrop-blur-md z-[110] flex items-center justify-center p-4 transition-opacity duration-300 \${workModalImage ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'}\`} onClick={() => setWorkModalImage(null)}>
                <div className="relative max-w-3xl w-full bg-surface-elevation border border-border-muted overflow-hidden scale-100 transition-transform duration-300"  onClick={(e) => e.stopPropagation()}>
                    <button className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 transition-colors z-20 p-2 rounded-full" onClick={() => setWorkModalImage(null)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="aspect-[3/4] w-full">
                        {workModalImage && <img src={workModalImage} className="w-full h-full object-cover" alt="Portfolio Reference" />}
                    </div>
                    <div className="p-6 border-t border-border-muted" style={{borderColor: '#353434'}}>
                        <h3 className="font-headline-md text-silver-text mb-1">Referencia Adjuntada</h3>
                        <p className="font-body-md text-on-surface-variant">Pieza de referencia para el turno</p>
                    </div>
                </div>
            </div>`;

const newModal = `{/* Work Modal */}
            <div className={\`fixed inset-0 bg-black/95 backdrop-blur-md z-[110] flex items-center justify-center p-4 transition-opacity duration-300 \${workModalData ? 'opacity-100' : 'opacity-0 pointer-events-none hidden'}\`} onClick={() => setWorkModalData(null)}>
                <div className="relative max-w-3xl w-full bg-surface-elevation border border-border-muted overflow-hidden scale-100 transition-transform duration-300 flex flex-col max-h-[90vh]"  onClick={(e) => e.stopPropagation()}>
                    <button className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 transition-colors z-20 p-2 rounded-full" onClick={() => setWorkModalData(null)}>
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="flex-1 overflow-y-auto w-full flex items-center justify-center bg-black">
                        {workModalData && <img src={workModalData.image} className="w-full h-auto object-contain max-h-[70vh]" alt="Portfolio Reference" />}
                    </div>
                    <div className="p-6 border-t border-border-muted bg-surface-container shrink-0" style={{borderColor: '#353434'}}>
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
                                <span className="w-fit px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20 rounded">
                                    Referencia subida
                                </span>
                            )}
                            {!workModalData?.tags?.includes('Refe. del portafolio') && !workModalData?.tags?.includes('Refe. del usuario') && (
                                <p className="font-body-md text-on-surface-variant">Pieza de referencia para el turno</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>`;
content = content.replace(oldModal, newModal);
fs.writeFileSync('src/components/DemoWaitlist.tsx', content);
