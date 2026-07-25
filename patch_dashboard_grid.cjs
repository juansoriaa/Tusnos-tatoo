const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const oldGrid = `<section className="grid grid-cols-3 gap-3">
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>visibility</span>
                                <span className="text-[10px] font-bold text-primary" style={{color: '#054d44'}}>+12%</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">12.4k</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">Vistas</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>touch_app</span>
                                <span className="text-[10px] font-bold text-primary" style={{color: '#054d44'}}>+5%</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">1.2k</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">Clicks</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest p-3 border border-primary/20 flex flex-col justify-between h-24 transition-all hover:border-primary">
                            <div className="flex justify-between items-start">
                                <span className="material-symbols-outlined text-primary text-lg" style={{color: '#054d44'}}>group</span>
                                <span className="text-[10px] font-bold text-primary" style={{color: '#054d44'}}>Active</span>
                            </div>
                            <div>
                                <h4 className="text-lg font-bold tracking-tighter text-on-surface">48</h4>
                                <p className="text-[9px] font-label-md uppercase text-on-surface-variant/60 tracking-wider">Espera</p>
                            </div>
                        </div>
                    </section>`;

const newGrid = `<section className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

content = content.replace(oldGrid, newGrid);
fs.writeFileSync('src/components/DemoDashboard.tsx', content);
