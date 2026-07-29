const fs = require('fs');
let code = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const match = code.match(/<div className="w-full max-w-\[280px\] bg-black rounded-\[2rem\][^>]*>([\s\S]*?)<\/article>\s*<\/div>\s*<\/div>/);

if (match) {
    const replacement = `<div className="w-full max-w-[280px] rounded-[1rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative group-hover:scale-105 transition-transform duration-500 origin-center mx-auto border-[4px] border-surface-variant bg-black">
                    <img src="/waitlist-mobile.png" alt="Lista de Espera" className="w-full h-auto object-cover" />
                  </div>`;
    code = code.replace(match[0], replacement);
    fs.writeFileSync('src/components/Landing.tsx', code);
    console.log("Successfully replaced CSS mock with img tag");
} else {
    console.log("Could not find the match");
}
