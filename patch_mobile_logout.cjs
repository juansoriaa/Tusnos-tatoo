const fs = require('fs');
let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

code = code.replace(
    /<button \s*className="w-full px-4 py-4 text-left font-label-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors flex items-center gap-3"\s*onClick=\{\(\) => \{\s*setIsMenuModalOpen\(false\);\s*setIsConfigModalOpen\(true\);\s*\}\}\s*>\s*<span className="material-symbols-outlined text-\[20px\]">settings<\/span>\s*Configuración personal\s*<\/button>/,
    `<button 
                            className="w-full px-4 py-4 text-left font-label-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors flex items-center gap-3 border-b border-outline-variant/30"
                            onClick={() => {
                                setIsMenuModalOpen(false);
                                setIsConfigModalOpen(true);
                            }}
                        >
                            <span className="material-symbols-outlined text-[20px]">settings</span>
                            Configuración personal
                        </button>
                        <button 
                            className="w-full px-4 py-4 text-left font-label-md text-on-surface-variant hover:bg-surface-variant hover:text-primary transition-colors flex items-center gap-3"
                            onClick={() => {
                                setIsMenuModalOpen(false);
                                handleNav('/');
                            }}
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Cerrar sesión
                        </button>`
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
