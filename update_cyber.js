import fs from 'fs';

// 1. Update ArtistProfile.tsx
let profileCode = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
profileCode = profileCode.replace(
  /className=\{`bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen \$\{artistData\?\.theme === 'pink_neon' \? 'theme-pink-neon' : ''\} \$\{artistData\?\.theme === 'minimal_clean' \? 'theme-minimal-clean' : ''\}`\}/g,
  'className={`bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen ${artistData?.theme === \'pink_neon\' ? \'theme-pink-neon\' : \'\'} ${artistData?.theme === \'minimal_clean\' ? \'theme-minimal-clean\' : \'\'} ${artistData?.theme === \'cyber_neon\' ? \'theme-cyber-neon\' : \'\'}`}'
);
fs.writeFileSync('src/components/ArtistProfile.tsx', profileCode);

// 2. Update DemoLayout.tsx
let layoutCode = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');
layoutCode = layoutCode.replace(
  /className=\{`bg-deep-black text-silver-text font-body-md h-\[100dvh\] overflow-hidden flex text-\[#e5e2e1\] bg-\[#050505\] \$\{theme === 'pink_neon' \? 'theme-pink-neon' : ''\} \$\{theme === 'minimal_clean' \? 'theme-minimal-clean' : ''\}`\}/g,
  'className={`bg-deep-black text-silver-text font-body-md h-[100dvh] overflow-hidden flex text-[#e5e2e1] bg-[#050505] ${theme === \'pink_neon\' ? \'theme-pink-neon\' : \'\'} ${theme === \'minimal_clean\' ? \'theme-minimal-clean\' : \'\'} ${theme === \'cyber_neon\' ? \'theme-cyber-neon\' : \'\'}`}'
);

const newThemeOption = `                            <div 
                                onClick={() => handleSaveTheme('cyber_neon')}
                                className={\`cursor-pointer border-2 rounded-xl p-4 flex flex-col gap-3 transition-all \${theme === 'cyber_neon' ? 'border-[#00F0FF] bg-[#00F0FF]/10' : 'border-outline-variant hover:border-gray-500 bg-surface'}\`}
                            >
                                <div className="h-24 rounded-lg bg-[#0A0A0C] flex items-center justify-center border border-outline-variant overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/20 to-transparent"></div>
                                    <span className="material-symbols-outlined text-[#00F0FF] text-3xl z-10" style={{textShadow: '0 0 10px rgba(0,240,255,0.8)'}}>memory</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-on-surface">Cyber Neon</h3>
                                    <p className="text-xs text-gray-400 mt-1">Negro profundo y cian eléctrico. Estética futurista.</p>
                                </div>
                                {theme === 'cyber_neon' && <div className="absolute top-2 right-2 text-[#00F0FF]"><span className="material-symbols-outlined text-sm">check_circle</span></div>}
                            </div>
`;

// Insert after minimal clean option
layoutCode = layoutCode.replace(
  /\{theme === 'minimal_clean' && <div className="absolute top-2 right-2 text-primary"><span className="material-symbols-outlined text-sm">check_circle<\/span><\/div>\}\s*<\/div>/g,
  `{theme === 'minimal_clean' && <div className="absolute top-2 right-2 text-primary"><span className="material-symbols-outlined text-sm">check_circle</span></div>}
                            </div>
${newThemeOption}`
);

// We should also change grid-cols-1 md:grid-cols-3 to grid-cols-1 md:grid-cols-2 lg:grid-cols-4
layoutCode = layoutCode.replace(/<div className="grid grid-cols-1 md:grid-cols-3 gap-4">/g, '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">');

fs.writeFileSync('src/components/DemoLayout.tsx', layoutCode);
