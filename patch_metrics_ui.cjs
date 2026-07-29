const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

// Fix grayscale on photos
code = code.replace(
    /className="w-full h-full object-cover grayscale"/g,
    'className="w-full h-full object-cover"'
);
code = code.replace(
    /className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"/g,
    'className="w-full h-full object-cover transition-all duration-500"'
);

// Fix Tasa Conversion overflow and tooltip
code = code.replace(
    /className="bg-surface-elevation border border-primary-container p-3 flex flex-col justify-between relative overflow-hidden col-span-2"/,
    'className="bg-surface-elevation border border-primary-container p-3 flex flex-col justify-between relative col-span-2"'
);

code = code.replace(
    /<div className="absolute top-0 right-0 w-12 h-12 bg-primary-container\/10 -mr-6 -mt-6 rotate-45 border-l border-b border-primary-container\/30" style=\{\{backgroundColor: 'rgba\\(5, 77, 68, 0\.1\\)', borderColor: 'rgba\\(5, 77, 68, 0\.3\\)'\}\}><\/div>/,
    `<div className="absolute inset-0 overflow-hidden pointer-events-none rounded"><div className="absolute top-0 right-0 w-12 h-12 bg-primary-container/10 -mr-6 -mt-6 rotate-45 border-l border-b border-primary-container/30" style={{backgroundColor: 'rgba(5, 77, 68, 0.1)', borderColor: 'rgba(5, 77, 68, 0.3)'}}></div></div>`
);

// Change info hover icon to accept focus on mobile
code = code.replace(
    /<div className="group relative inline-block">/g,
    '<div className="group relative inline-block" tabIndex={0}>'
);

// Fix Agenda tooltip positioning (Agenda is right column on mobile, so right-0 instead of left-1/2)
code = code.replace(
    /<div className="absolute bottom-full left-1\/2 -translate-x-1\/2 mb-2 w-48 p-2 bg-surface-container-high border border-border-muted text-\[10px\] text-silver-text rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-center leading-tight normal-case font-normal" style=\{\{backgroundColor: '#232222', borderColor: '#353434'\}\}>/,
    `<div className="absolute bottom-full right-0 md:left-1/2 md:-translate-x-1/2 mb-2 w-48 p-2 bg-surface-container-high border border-border-muted text-[10px] text-silver-text rounded shadow-xl opacity-0 invisible group-focus:opacity-100 group-focus:visible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-left md:text-center leading-tight normal-case font-normal" style={{backgroundColor: '#232222', borderColor: '#353434'}}>`
);

// Fix Conversion tooltip positioning (Conversion is full width on mobile, so bottom-full left-0 is fine, just add focus group)
code = code.replace(
    /<div className="absolute bottom-full left-0 mb-2 w-56 p-2 bg-surface-container-high border border-border-muted text-\[10px\] text-silver-text rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-left leading-tight normal-case font-normal" style=\{\{backgroundColor: '#232222', borderColor: '#353434'\}\}>/,
    `<div className="absolute bottom-full left-0 mb-2 w-[calc(100vw-3rem)] max-w-[280px] sm:w-56 p-2 bg-surface-container-high border border-border-muted text-[10px] text-silver-text rounded shadow-xl opacity-0 invisible group-focus:opacity-100 group-focus:visible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none text-left leading-tight normal-case font-normal" style={{backgroundColor: '#232222', borderColor: '#353434'}}>`
);


fs.writeFileSync('src/components/DemoMetrics.tsx', code);
