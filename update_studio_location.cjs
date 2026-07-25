const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// 1. Add states
const stateInsert = `    const [mapLink, setMapLink] = useState('');
    const [hasPhysicalStudio, setHasPhysicalStudio] = useState(true);
    const [studioName, setStudioName] = useState('');
    const [studioDescription, setStudioDescription] = useState('');
    const [studioAddress, setStudioAddress] = useState('');
    const [studioHours, setStudioHours] = useState('');`;
content = content.replace("    const [mapLink, setMapLink] = useState('');", stateInsert);

// 2. Add to load logic
const loadInsert = `                setMapLink(data.mapLink || '');
                setHasPhysicalStudio(data.hasPhysicalStudio !== false);
                setStudioName(data.studioName || '');
                setStudioDescription(data.studioDescription || '');
                setStudioAddress(data.studioAddress || '');
                setStudioHours(data.studioHours || '');`;
content = content.replace("                setMapLink(data.mapLink || '');", loadInsert);

// 3. Add to save logic
const saveInsert = `                                        mapLink: mapLink,
                                        hasPhysicalStudio: hasPhysicalStudio,
                                        studioName: studioName,
                                        studioDescription: studioDescription,
                                        studioAddress: studioAddress,
                                        studioHours: studioHours,`;
content = content.replace("                                        mapLink: mapLink,", saveInsert);

// 4. Update UI
const uiSearch = `{/* Studio Location Section */}
                        <div className="bg-surface-container p-6 border border-outline-variant/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{color: '#054d44'}}>location_on</span>
                                </div>
                                <h3 className="font-headline-md text-sm font-bold uppercase tracking-widest text-on-surface">Studio Location</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-4">
                                    <div className="w-full">
                                        <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Google Maps Link</label>
                                        <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Enlace de ubicación" type="text" value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
                                    </div>
                                    <button className="w-full py-3 border border-outline-variant/30 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors">
                                        No tengo estudio físico
                                    </button>
                                </div>
                            </div>`;

const uiReplace = `{/* Studio Location Section */}
                        <div className="bg-surface-container p-6 border border-outline-variant/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-none bg-primary/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl" style={{color: '#054d44'}}>location_on</span>
                                </div>
                                <h3 className="font-headline-md text-sm font-bold uppercase tracking-widest text-on-surface">Ubicación del Estudio</h3>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex justify-between items-center bg-surface-container-low p-4 border border-outline-variant/10">
                                    <span className="font-caption text-sm uppercase tracking-wider text-on-surface">¿Atiendes en un estudio físico?</span>
                                    <div className="relative inline-block w-12 h-6 align-middle select-none transition duration-200 ease-in">
                                        <input 
                                            type="checkbox" 
                                            className="toggle-checkbox peer absolute block w-6 h-6 rounded-none bg-surface border-2 border-outline-variant appearance-none cursor-pointer z-10 checked:translate-x-6 checked:border-emerald-accent transition-transform duration-300 ease-in-out" 
                                            checked={hasPhysicalStudio} 
                                            onChange={(e) => setHasPhysicalStudio(e.target.checked)} 
                                        />
                                        <label className="toggle-label block overflow-hidden h-6 rounded-none bg-surface-container-highest border border-outline-variant cursor-pointer"></label>
                                    </div>
                                </div>

                                {hasPhysicalStudio && (
                                    <div className="flex flex-col gap-4 animate-fade-in">
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Nombre del estudio</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Ej: Turnos Tattoo Studio" type="text" value={studioName} onChange={(e) => setStudioName(e.target.value)} />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Breve descripción</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Ej: Estudio privado, solo con cita previa" type="text" value={studioDescription} onChange={(e) => setStudioDescription(e.target.value)} />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Dirección, Distrito y Ciudad</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Ej: Calle 124, Florencio Varela, GBA Sur" type="text" value={studioAddress} onChange={(e) => setStudioAddress(e.target.value)} />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Días y Horarios</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Ej: Lunes a Sábados de 14:00 a 20:00 hs" type="text" value={studioHours} onChange={(e) => setStudioHours(e.target.value)} />
                                        </div>
                                        <div className="w-full">
                                            <label className="block text-caption font-caption text-on-surface-variant uppercase mb-1">Link de Google Maps</label>
                                            <input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="https://maps.app.goo.gl/..." type="text" value={mapLink} onChange={(e) => setMapLink(e.target.value)} />
                                            <p className="text-[10px] text-on-surface-variant/70 mt-1 uppercase tracking-wider">El link hará que la dirección sea clickeable y lleve al mapa.</p>
                                        </div>
                                    </div>
                                )}
                            </div>`;

content = content.replace(uiSearch, uiReplace);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
