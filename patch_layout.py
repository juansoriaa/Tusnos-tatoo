import re

with open('src/components/DemoLayout.tsx', 'r') as f:
    content = f.read()

# Add states
state_injection = """
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
"""

content = content.replace("const [animateHighlight, setAnimateHighlight] = useState(false);", "const [animateHighlight, setAnimateHighlight] = useState(false);\n" + state_injection)

# Add onClick to menu button
menu_btn_regex = r"<button className=\"text-on-surface-variant hover:text-primary transition-all active:scale-95\">\s*<span className=\"material-symbols-outlined text-\[20px\]\">menu</span>\s*</button>"
new_menu_btn = """<button className="text-on-surface-variant hover:text-primary transition-all active:scale-95" onClick={() => setIsMenuModalOpen(true)}>
                        <span className="material-symbols-outlined text-[20px]">menu</span>
                    </button>"""
content = re.sub(menu_btn_regex, new_menu_btn, content)

# Inject modals before last </div>
modals_code = """
            {/* Menu Modal */}
            {isMenuModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-end bg-black/60 backdrop-blur-sm p-4 pt-16" onClick={() => setIsMenuModalOpen(false)}>
                    <div className="bg-surface-container w-56 rounded-lg border border-outline-variant/30 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="w-full px-4 py-4 text-left font-label-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors flex items-center gap-3"
                            onClick={() => {
                                setIsMenuModalOpen(false);
                                setIsConfigModalOpen(true);
                            }}
                        >
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            Configuración personal
                        </button>
                    </div>
                </div>
            )}

            {/* Config Modal */}
            {isConfigModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsConfigModalOpen(false)}>
                    <div className="bg-surface-container w-full max-w-sm rounded-2xl border border-outline-variant/30 p-6 shadow-2xl flex flex-col relative animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
                        <button 
                            className="absolute top-4 right-4 text-on-surface-variant hover:text-error transition-colors"
                            onClick={() => setIsConfigModalOpen(false)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary" style={{backgroundColor: 'rgba(5, 77, 68, 0.2)', color: '#95d2c6'}}>
                                <span className="material-symbols-outlined">shield_person</span>
                            </div>
                            <h3 className="font-headline-md text-xl font-bold uppercase tracking-tighter">Seguridad</h3>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex flex-col gap-1">
                                <label className="font-label-sm text-[10px] text-secondary uppercase tracking-widest">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    placeholder="correo@ejemplo.com"
                                    className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 text-sm text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors rounded"
                                />
                                <p className="text-[10px] text-on-surface-variant/70 mt-1 leading-tight">Este correo también servirá para ingresar a tu cuenta junto a tu usuario de siempre.</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-label-sm text-[10px] text-secondary uppercase tracking-widest">Nueva Contraseña</label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••"
                                    className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 text-sm text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors rounded"
                                />
                                <p className="text-[10px] text-on-surface-variant/70 mt-1 leading-tight">Cambia tu contraseña por defecto para mayor seguridad.</p>
                            </div>
                        </div>

                        <button 
                            className="w-full py-3 bg-emerald-accent text-on-primary font-bold text-xs uppercase tracking-widest rounded hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_15px_rgba(5,77,68,0.4)]"
                            style={{backgroundColor: '#054d44'}}
                            onClick={() => {
                                alert('Configuración guardada exitosamente');
                                setIsConfigModalOpen(false);
                            }}
                        >
                            Guardar Cambios
                        </button>
                    </div>
                </div>
            )}
"""

content = content.replace("        </div>\n    );\n}", modals_code + "\n        </div>\n    );\n}")

with open('src/components/DemoLayout.tsx', 'w') as f:
    f.write(content)

