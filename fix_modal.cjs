const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// First, remove the existing modal HTML wherever it is
// We can find it by looking for "{waitlistModalOpen && (" up to its closing ")}".
// This is tricky because it contains a lot of divs.

const modalRegex = /\{waitlistModalOpen && \([\s\S]*?Agendarme\s*<\/button>\s*<\/div>\s*<\/div>\s*\)\}/;
code = code.replace(modalRegex, '');

// Now we insert it at the very end of the component, just before the last </div>
const modalHtml = `
      {waitlistModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
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
                
                let existingMessages = [];
                try {
                  const saved = localStorage.getItem('demoWaitlistMessages');
                  if (saved) existingMessages = JSON.parse(saved);
                } catch(e) {}
                
                existingMessages.unshift(newMessage);
                localStorage.setItem('demoWaitlistMessages', JSON.stringify(existingMessages));
                window.dispatchEvent(new CustomEvent('newWaitlistMessage'));
                
                setWaitlistModalOpen(false);
                setWaitlistForm({ phone: '', type: 'consulta', description: '' });
                alert('¡Mensaje enviado a la agenda del tatuador!');
              }}
            >
              Agendarme
            </button>
          </div>
        </div>
      )}`;

// To put it at the very end of the file, right before the last closing tags
const lines = code.split('\n');
let lastDivIdx = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('</div>')) {
    lastDivIdx = i;
    break;
  }
}
if (lastDivIdx !== -1) {
  lines.splice(lastDivIdx, 0, modalHtml);
}
code = lines.join('\n');
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
