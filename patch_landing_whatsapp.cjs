const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

const whatsappHandler = `  const handleWhatsAppRedirect = () => {
    const message = 'hola vengo de la página turnos tatoo quiero mi página';
    window.open(\`https://wa.me/541140679334?text=\${encodeURIComponent(message)}\`, '_blank');
  };`;

content = content.replace(
    /const handleLogin = async \(\) => {/,
    whatsappHandler + '\n\n  const handleLogin = async () => {'
);

// Replace button onClick handlers
content = content.replace(
    /onClick=\{\(\) => \{ if\(user\) navigate\('\/demo\/dashboard'\); else setContactModalOpen\(true\); \}\}/,
    `onClick={() => { if(user) navigate('/demo/dashboard'); else handleWhatsAppRedirect(); }}`
);

content = content.replace(
    /onClick=\{\(\) => setContactModalOpen\(true\)\} className="w-full md:w-auto px-12 py-5 bg-primary text-white font-black text-body-md uppercase tracking-\[0\.2em\] hover:bg-white hover:text-black transition-all duration-300 active:scale-95 shadow-\[0_0_30px_rgba\(5,77,68,0\.4\)\]">Quiero mi página<\/button>/,
    `onClick={handleWhatsAppRedirect} className="w-full md:w-auto px-12 py-5 bg-primary text-white font-black text-body-md uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 active:scale-95 shadow-[0_0_30px_rgba(5,77,68,0.4)]">Quiero mi página</button>`
);

content = content.replace(
    /onClick=\{\(\) => setContactModalOpen\(true\)\} className="px-16 py-6 bg-primary text-white font-black text-xl uppercase tracking-\[0\.2em\] hover:bg-white hover:text-black transition-all duration-300 shadow-\[0_0_40px_rgba\(5,77,68,0\.4\)\] hover:shadow-\[0_0_60px_rgba\(5,77,68,0\.6\)\] scale-100 hover:scale-105">Quiero mi página<\/button>/,
    `onClick={handleWhatsAppRedirect} className="px-16 py-6 bg-primary text-white font-black text-xl uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_40px_rgba(5,77,68,0.4)] hover:shadow-[0_0_60px_rgba(5,77,68,0.6)] scale-100 hover:scale-105">Quiero mi página</button>`
);

content = content.replace(
    /<a className="text-on-surface font-bold hover:text-primary transition-colors ml-1 md:ml-2 underline decoration-primary underline-offset-4 block mt-2 md:inline md:mt-0" href="#">\s*Quiero mi página\s*<\/a>/,
    `<button onClick={handleWhatsAppRedirect} type="button" className="text-on-surface font-bold hover:text-primary transition-colors ml-1 md:ml-2 underline decoration-primary underline-offset-4 block mt-2 md:inline md:mt-0" >
                    Quiero mi página
                  </button>`
);

fs.writeFileSync('src/components/Landing.tsx', content);
console.log("Patched Landing.tsx successfully!");
