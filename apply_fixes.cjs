const fs = require('fs');

function repl(file, searchStr, replaceStr) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.split(searchStr).join(replaceStr);
    fs.writeFileSync(file, content, 'utf8');
}

// 1. sw.js
repl('public/sw.js', 
    "self.addEventListener('fetch', (event) => {", 
    "self.addEventListener('fetch', (event) => {\n  const url = new URL(event.request.url);\n  if (url.hostname.includes('googleapis.com') || url.hostname.includes('gstatic.com')) return;"
);

// 2. DemoPortfolio query limits and 12 limit
repl('src/components/DemoPortfolio.tsx', 
    "orderBy('createdAt', 'desc')", 
    "orderBy('createdAt', 'desc'),\n                        limit(50)"
);
repl('src/components/DemoPortfolio.tsx', 
    "const fallbackQ = query(collection(db, 'photos'), where('createdBy', '==', artistUid));", 
    "const fallbackQ = query(collection(db, 'photos'), where('createdBy', '==', artistUid), limit(50));"
);
repl('src/components/DemoPortfolio.tsx', "existingPhotos.length >= 15", "existingPhotos.length >= 12");
repl('src/components/DemoPortfolio.tsx', "<strong>15 obras</strong>", "<strong>12 obras</strong>");

// 3. DemoPortfolio Base64 Guard
repl('src/components/DemoPortfolio.tsx', 
    "const isRealUser = localStorage.getItem('demoUserId') !== 'demo' && localStorage.getItem('demoUserId') !== 'anonymous_demo';",
    "const isRealUser = localStorage.getItem('demoUserId') !== 'demo' && localStorage.getItem('demoUserId') !== 'anonymous_demo';\n                        if (photoDataUrl.startsWith('data:image/')) {\n                            setIsSaving(false);\n                            setErrorModalMsg('Error crítico: Intentando guardar Base64 en base de datos. Operación abortada.');\n                            return;\n                        }"
);

// 4. ArtistProfile
repl('src/components/ArtistProfile.tsx', 
    "where('userTag', '==', tag)", 
    "where('userTag', '==', tag), limit(1)"
);
repl('src/components/ArtistProfile.tsx', 
    "}).filter((photo: any) => {", 
    "}).filter((photo: any) => {\n                            if (photo.src && photo.src.startsWith('data:image/')) return false;"
);
repl('src/components/ArtistProfile.tsx', 
    "return isTargetDemo() ? DEMO_FALLBACK_PHOTOS : [];", 
    "return isTargetDemo() ? DEMO_FALLBACK_PHOTOS : [];\n    const limit = (window as any).limit || null; // Avoid unused"
);

// 5. PhotoUploader Hover
repl('src/components/PhotoUploader.tsx', 
    "opacity-0 group-hover:opacity-100", 
    "opacity-100 md:opacity-0 group-hover:opacity-100"
);

// 6. Translations
const trans = [
    ['"Blackwork Samurai"', '"Samurai Blackwork"'],
    ['"Blackwork samurai tattoo on forearm."', '"Tatuaje de samurai estilo blackwork en antebrazo."'],
    ['"Detailed black & grey realism"', '"Realismo detallado en sombras"'],
    ['"Delicate minimalist single rose"', '"Rosa minimalista delicada"'],
    ['"Close-up of a delicate minimalist tattoo of a single rose."', '"Tatuaje minimalista de línea fina de una rosa."'],
    ['"Large-scale blackwork back piece"', '"Pieza completa de espalda en Blackwork"'],
    ['"Large-scale blackwork tattoo covering a full back."', '"Tatuaje de espalda completa con diseños oscuros."']
];
for(const [s, r] of trans) {
    repl('src/components/DemoPortfolio.tsx', s, r);
    repl('src/components/Landing.tsx', s, r);
    repl('src/components/DemoMetrics.tsx', s, r);
    repl('src/components/SuperAdmin.tsx', s, r);
}

// 7. DemoPortfolio Error Modal
repl('src/components/DemoPortfolio.tsx', 
    "const [showPinLimitModal, setShowPinLimitModal] = useState(false);", 
    "const [showPinLimitModal, setShowPinLimitModal] = useState(false);\n    const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);"
);
repl('src/components/DemoPortfolio.tsx', "alert('Por favor selecciona una imagen primero.');", "setErrorModalMsg('Por favor selecciona una imagen primero.');");
repl('src/components/DemoPortfolio.tsx', "alert('El nombre de la obra es requerido.');", "setErrorModalMsg('El nombre de la obra es requerido.');");
repl('src/components/DemoPortfolio.tsx', "alert('Hubo un error al guardar la obra.');", "setErrorModalMsg('Hubo un error al guardar la obra.');");
repl('src/components/DemoPortfolio.tsx', "alert(\"Hubo un error al eliminar la foto.\");", "setErrorModalMsg('Hubo un error al eliminar la foto.');");

let dp = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');
dp = dp.replace(/alert\(err\.message \|\| 'Error al subir la imagen\. Por favor verifica tu conexi.n y sesi.n\.'\);/g, "setErrorModalMsg(err.message || 'Error al subir la imagen. Por favor verifica tu conexión y sesión.');");
fs.writeFileSync('src/components/DemoPortfolio.tsx', dp, 'utf8');

const modalUI = '{errorModalMsg && (<div className=\"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm\" onClick={() => setErrorModalMsg(null)}><div className=\"modal-container bg-surface-elevation border border-error/30 rounded-xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden\" onClick={e => e.stopPropagation()} style={{backgroundColor: \\'#141313\\'}}><div className=\"absolute top-0 left-0 right-0 h-1 bg-error\"></div><div className=\"w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4\"><span className=\"material-symbols-outlined text-error text-3xl\">error</span></div><h3 className=\"text-xl font-headline-md text-silver-text mb-2\">Aviso</h3><p className=\"text-on-surface-variant font-body-md text-sm mb-6 whitespace-pre-wrap\">{errorModalMsg}</p><button onClick={() => { setErrorModalMsg(null); if (errorModalMsg.includes(\\'sesión ha expirado\\')) { localStorage.removeItem(\\'demoUserId\\'); auth.signOut().then(() => window.location.href = \\'/?login=true\\'); } }} className=\"modal-submit-btn w-full py-3 bg-error text-white font-label-md uppercase tracking-wider rounded font-bold hover:brightness-110 transition-all\">Entendido</button></div></div>)}';

repl('src/components/DemoPortfolio.tsx', "</DemoLayout>", modalUI + "\n            </DemoLayout>");

console.log('done');
