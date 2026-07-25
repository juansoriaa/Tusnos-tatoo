const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// 1. Add state for the new modal
if (!code.includes('const [waitlistModalOpen')) {
  code = code.replace(
    /const \[showMore, setShowMore\] = useState\(false\);/,
    `const [showMore, setShowMore] = useState(false);\n  const [waitlistModalOpen, setWaitlistModalOpen] = useState(false);\n  const [waitlistForm, setWaitlistForm] = useState({ phone: '', type: 'consulta', description: '' });`
  );
}

// 2. Button Replacement
const btnStart = 'className={`w-full max-w-md py-3 px-6 font-label-md text-label-md font-extrabold uppercase tracking-widest shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-4 relative overflow-hidden ${artistData?.isAvailable !== false ? \'bg-primary text-on-primary hover:bg-[#065f46] active:scale-95 shimmer-btn\' : \'bg-surface-variant text-on-surface-variant cursor-not-allowed\'}`}';
const btnEnd = `'Agenda Cerrada'`;

code = code.replace(btnStart, 'className={`w-full max-w-md py-3 px-6 font-label-md text-label-md font-extrabold uppercase tracking-widest shadow-2xl transition-all duration-300 transform flex items-center justify-center gap-4 relative overflow-hidden ${artistData?.isAvailable !== false ? \'bg-primary text-on-primary hover:bg-[#065f46] active:scale-95 shimmer-btn\' : \'bg-surface-variant text-on-surface-variant hover:bg-surface-container active:scale-95 border border-outline-variant\'}`}');

const onClickStr = `disabled={artistData?.isAvailable === false}
            onClick={() => {
              if (artistData?.whatsapp) {
                const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                window.open(\`https://wa.me/549\${num}\`, '_blank');
              }
            }}`;
const newOnClickStr = `onClick={() => {
              if (artistData?.isAvailable !== false) {
                if (artistData?.whatsapp) {
                  const num = artistData.whatsapp.replace(/[^0-9]/g, '');
                  window.open(\`https://wa.me/549\${num}\`, '_blank');
                }
              } else {
                setWaitlistModalOpen(true);
              }
            }}`;

code = code.replace(onClickStr, newOnClickStr);
code = code.replace(/'Agenda Cerrada'/g, `'Lista Llena Agéndate'`);

// 3. Add modal at the end of return (just before the last </div>)
const modalHtml = `
      {waitlistModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-surface-container border border-outline-variant w-full max-w-md p-6 relative flex flex-col gap-4">
            <button 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white"
              onClick={() => setWaitlistModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-md text-xl text-on-surface uppercase tracking-tighter">Agéndate en la lista</h2>
            <p className="text-sm text-on-surface-variant bg-surface-variant/50 p-3 border border-outline-variant/30 rounded">
              El tatuador se encuentra ocupado. Cuando se libere, te enviará un mensaje.
            </p>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Tu número de WhatsApp</label>
              <input 
                type="text" 
                placeholder="+54 9 11..."
                className="bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full"
                value={waitlistForm.phone}
                onChange={e => setWaitlistForm({...waitlistForm, phone: e.target.value})}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Título (Consulta o Idea)</label>
              <select 
                className="bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full cursor-pointer appearance-none"
                value={waitlistForm.type}
                onChange={e => setWaitlistForm({...waitlistForm, type: e.target.value})}
              >
                <option value="consulta">Consulta general</option>
                <option value="idea">Tengo una idea</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Descripción</label>
              <textarea 
                rows={3}
                placeholder="Cuéntame más..."
                className="bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full resize-none"
                value={waitlistForm.description}
                onChange={e => setWaitlistForm({...waitlistForm, description: e.target.value})}
              ></textarea>
            </div>
            <button 
              className="w-full py-3 mt-2 bg-emerald-accent text-on-surface font-label-md font-extrabold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
              style={{backgroundColor: '#054d44', color: '#e5e2e1'}}
              onClick={() => {
                const newMessage = {
                  id: Date.now(),
                  name: waitlistForm.phone || 'Sin número',
                  time: 'Justo ahora',
                  title: waitlistForm.type === 'consulta' ? 'Consulta general' : 'Idea de tatuaje',
                  text: waitlistForm.description || 'Sin descripción',
                  hasImage: false,
                  type: 'Nueva solicitud',
                  typeClass: 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-border-muted whitespace-nowrap'
                };
                
                // Save to localStorage
                let existingMessages = [];
                try {
                  const saved = localStorage.getItem('demoWaitlistMessages');
                  if (saved) existingMessages = JSON.parse(saved);
                } catch(e) {}
                
                existingMessages.unshift(newMessage);
                localStorage.setItem('demoWaitlistMessages', JSON.stringify(existingMessages));
                
                // Dispatch event for layout badge update
                window.dispatchEvent(new CustomEvent('newWaitlistMessage'));
                
                setWaitlistModalOpen(false);
                setWaitlistForm({ phone: '', type: 'consulta', description: '' });
              }}
            >
              Agendarme
            </button>
          </div>
        </div>
      )}
`;

if (!code.includes('waitlistModalOpen &&')) {
    const lines = code.split('\n');
    let lastDivIdx = -1;
    for(let i = lines.length - 1; i >= 0; i--) {
        if(lines[i].includes('</div>')) {
            lastDivIdx = i;
            break;
        }
    }
    if (lastDivIdx !== -1) {
        lines.splice(lastDivIdx, 0, modalHtml);
        code = lines.join('\n');
    }
}

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
