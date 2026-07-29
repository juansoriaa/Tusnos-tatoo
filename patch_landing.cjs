const fs = require('fs');
let code = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const target = `<div className="w-full max-w-[280px] rounded-[1rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative group-hover:scale-105 transition-transform duration-500 origin-center mx-auto border-[4px] border-surface-variant bg-black">
                    <img src="/waitlist-mobile.png" alt="Lista de Espera" className="w-full h-auto object-cover" />
                  </div>`;
                  
const replacement = `<img src="/waitlist-mobile.png" alt="Lista de Espera" className="w-full max-w-sm h-auto object-contain rounded-lg shadow-2xl group-hover:scale-105 transition-transform duration-500 origin-center mx-auto" />`;

code = code.replace(target, replacement);

// Also remove bg-surface-elevation from the wrapper
code = code.replace(
    `<div className="w-full md:w-1/2 relative bg-surface-elevation p-6 flex items-center justify-center">`,
    `<div className="w-full md:w-1/2 relative p-6 flex items-center justify-center">`
);

fs.writeFileSync('src/components/Landing.tsx', code);
