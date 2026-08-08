import fs from 'fs';

// 1. Update ArtistProfile.tsx
let profileCode = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
profileCode = profileCode.replace(
  /className=\{`bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen \$\{artistData\?\.theme === 'pink_neon' \? 'theme-pink-neon' : ''\}`\}/g,
  'className={`bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen ${artistData?.theme === \'pink_neon\' ? \'theme-pink-neon\' : \'\'} ${artistData?.theme === \'minimal_clean\' ? \'theme-minimal-clean\' : \'\'}`}'
);
fs.writeFileSync('src/components/ArtistProfile.tsx', profileCode);

// 2. Update DemoLayout.tsx
let layoutCode = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');
layoutCode = layoutCode.replace(
  /className=\{`bg-deep-black text-silver-text font-body-md h-\[100dvh\] overflow-hidden flex text-\[#e5e2e1\] bg-\[#050505\] \$\{theme === 'pink_neon' \? 'theme-pink-neon' : ''\}`\}/g,
  'className={`bg-deep-black text-silver-text font-body-md h-[100dvh] overflow-hidden flex text-[#e5e2e1] bg-[#050505] ${theme === \'pink_neon\' ? \'theme-pink-neon\' : \'\'} ${theme === \'minimal_clean\' ? \'theme-minimal-clean\' : \'\'}`}'
);

const newThemeOption = `                            <div 
                                onClick={() => handleSaveTheme('minimal_clean')}
                                className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-3 transition-all \${theme === 'minimal_clean' ? 'border-primary bg-primary/10' : 'border-outline-variant hover:border-gray-500 bg-surface'}\`}
                            >
                                <div className="h-24 rounded-lg bg-surface-variant flex items-center justify-center border border-outline-variant overflow-hidden relative">
                                    <div className="absolute inset-0 bg-[#F9F9FB]"></div>
                                    <span className="material-symbols-outlined text-[#111111] text-3xl z-10">water_drop</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-on-surface">Minimal Clean</h3>
                                    <p className="text-xs text-gray-400 mt-1">Blanco puro, tipografía fina, profesional y elegante.</p>
                                </div>
                                {theme === 'minimal_clean' && <div className="absolute top-2 right-2 text-primary"><span className="material-symbols-outlined text-sm">check_circle</span></div>}
                            </div>
`;

// Insert after pink neon option
layoutCode = layoutCode.replace(
  /\{theme === 'pink_neon' && <div className="absolute top-2 right-2 text-\[#FF2A85\]"><span className="material-symbols-outlined text-sm">check_circle<\/span><\/div>\}\s*<\/div>/g,
  `{theme === 'pink_neon' && <div className="absolute top-2 right-2 text-[#FF2A85]"><span className="material-symbols-outlined text-sm">check_circle</span></div>}
                            </div>
${newThemeOption}`
);

// We should also change grid-cols-2 to grid-cols-1 md:grid-cols-3 in the modal to fit 3 options
layoutCode = layoutCode.replace(/<div className="grid grid-cols-1 md:grid-cols-2 gap-4">/g, '<div className="grid grid-cols-1 md:grid-cols-3 gap-4">');

fs.writeFileSync('src/components/DemoLayout.tsx', layoutCode);
