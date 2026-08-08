import fs from 'fs';
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const targetState = `    const [toastMessage, setToastMessage] = useState<string | null>(null);`;
const repState = `    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [theme, setTheme] = useState('default');
    const [themeModalOpen, setThemeModalOpen] = useState(false);`;
code = code.replace(targetState, repState);

const targetLoad = `                setStudioHours(data.studioHours || '');`;
const repLoad = `                setStudioHours(data.studioHours || '');
                setTheme(data.theme || 'default');`;
code = code.replace(targetLoad, repLoad);

const targetInitStr = `                    studioHours: data.studioHours || '',
                    mapLink: data.mapLink || '',
                    faqs: data.faqs || defaultFaqs
                }));`;
const repInitStr = `                    studioHours: data.studioHours || '',
                    mapLink: data.mapLink || '',
                    faqs: data.faqs || defaultFaqs,
                    theme: data.theme || 'default'
                }));`;
code = code.replace(targetInitStr, repInitStr);

const targetInitData = `                faqs: defaultFaqs
            };`;
const repInitData = `                faqs: defaultFaqs,
                theme: 'default'
            };`;
code = code.replace(targetInitData, repInitData);

const targetInitDataSets = `            setAvatarUrl(initData.avatarUrl);`;
const repInitDataSets = `            setAvatarUrl(initData.avatarUrl);
            setTheme(initData.theme);`;
code = code.replace(targetInitDataSets, repInitDataSets);

const targetSave = `            studioHours,
            mapLink,
            faqs
        };`;
const repSave = `            studioHours,
            mapLink,
            faqs,
            theme
        };`;
code = code.replace(targetSave, repSave);

// Add the theme icon in the top header (next to Profile Photo)
const targetHeader = `                            <button onClick={() => navigate('/demo/portfolio')} className="md:hidden flex items-center justify-center p-2 text-on-surface-variant hover:text-white transition-colors bg-surface-variant/50 rounded-lg">
                                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                            </button>
                        </div>`;
const repHeader = `                            <button onClick={() => navigate('/demo/portfolio')} className="md:hidden flex items-center justify-center p-2 text-on-surface-variant hover:text-white transition-colors bg-surface-variant/50 rounded-lg">
                                <span className="material-symbols-outlined text-[20px]">grid_view</span>
                            </button>
                            <button onClick={() => setThemeModalOpen(true)} className="flex items-center justify-center p-2 text-on-surface-variant hover:text-primary transition-colors bg-surface-variant/50 hover:bg-surface-variant rounded-lg" title="Estilos de Diseño">
                                <span className="material-symbols-outlined text-[20px]">palette</span>
                            </button>
                        </div>`;
code = code.replace(targetHeader, repHeader);

// Add the modal at the end of the file, before return
const targetModal = `            {/* Toast Notification */}`;
const repModal = `            {/* Theme Modal */}
            {themeModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface-container border border-outline-variant w-full max-w-lg p-6 relative flex flex-col gap-6 overflow-hidden rounded-2xl shadow-2xl">
                        <button type="button" onClick={() => setThemeModalOpen(false)} className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10 p-1 bg-black/40 rounded-full">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <div>
                            <h2 className="font-headline-md text-xl font-bold mb-2">Estilo de Diseño</h2>
                            <p className="text-sm text-gray-400">Selecciona la apariencia visual de tu perfil público. Los cambios se guardarán automáticamente.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div 
                                onClick={() => { setTheme('default'); handleSave(); }}
                                className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-3 transition-all \${theme === 'default' ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-gray-500 bg-surface'}\`}
                            >
                                <div className="h-24 rounded-lg bg-surface-variant flex items-center justify-center border border-outline-variant overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent"></div>
                                    <span className="material-symbols-outlined text-primary text-3xl z-10">water_drop</span>
                                </div>
                                <div>
                                    <h3 className="font-bold">Predeterminado</h3>
                                    <p className="text-xs text-gray-400 mt-1">Verde esmeralda, elegante y profesional.</p>
                                </div>
                                {theme === 'default' && <div className="absolute top-2 right-2 text-primary"><span className="material-symbols-outlined text-sm">check_circle</span></div>}
                            </div>

                            <div 
                                onClick={() => { setTheme('pink_neon'); handleSave(); }}
                                className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-3 transition-all \${theme === 'pink_neon' ? 'border-[#FF2A85] bg-[#FF2A85]/10' : 'border-outline-variant hover:border-gray-500 bg-surface'}\`}
                            >
                                <div className="h-24 rounded-lg bg-surface-variant flex items-center justify-center border border-outline-variant overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF2A85]/20 to-transparent"></div>
                                    <span className="material-symbols-outlined text-[#FF2A85] text-3xl z-10">bolt</span>
                                </div>
                                <div>
                                    <h3 className="font-bold">Neo-Traditional Pink</h3>
                                    <p className="text-xs text-gray-400 mt-1">Rosa fucsia neón, vibrante y llamativo.</p>
                                </div>
                                {theme === 'pink_neon' && <div className="absolute top-2 right-2 text-[#FF2A85]"><span className="material-symbols-outlined text-sm">check_circle</span></div>}
                            </div>
                        </div>

                        <div className="flex justify-end mt-2">
                            <button onClick={() => setThemeModalOpen(false)} className="px-6 py-2 bg-surface-variant text-white font-bold hover:bg-gray-700 transition-colors rounded-lg">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}`;
code = code.replace(targetModal, repModal);

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
