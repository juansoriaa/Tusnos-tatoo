const fs = require('fs');
let code = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

code = code.replace(
    /<span className=\{\`material-symbols-outlined mb-1 text-\[20px\] transition-colors \$\{selectedGalleryPhoto\.pinnedOrder \? 'text-emerald-accent' : 'text-silver-text group-hover:text-white'\}\`\}>push_pin<\/span>/,
    `<span className={\`material-symbols-outlined mb-1 text-[20px] transition-colors \${selectedGalleryPhoto.pinnedOrder ? 'text-emerald-accent' : 'text-silver-text group-hover:text-white'}\`}>star</span>`
);

code = code.replace(
    /<span className="font-label-sm text-\[10px\] text-silver-text">\{selectedGalleryPhoto\.pinnedOrder \? 'Quitar Pin' : 'Destacar'\}<\/span>/,
    `<span className="font-label-sm text-[10px] text-silver-text">{selectedGalleryPhoto.pinnedOrder ? 'Quitar Destacado' : 'Destacar'}</span>`
);

fs.writeFileSync('src/components/DemoPortfolio.tsx', code);
