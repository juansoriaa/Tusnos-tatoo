const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

// Replace Zone 1
const zone1Start = '<div className="grid grid-cols-2 md:grid-cols-5 gap-4">';
const zone1End = '            </div>\n          </section>\n          </div>';

const idxStart = content.indexOf(zone1Start);
const idxEnd = content.indexOf(zone1End, idxStart);

if (idxStart !== -1 && idxEnd !== -1) {
    const newGrid = `<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Quick Action: Crear New */}
              <div className="col-span-2 md:col-span-1 rounded-xl bg-gradient-to-br from-primary-container to-surface-container border border-outline-variant/30 p-4 md:p-6 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 mb-4">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-primary text-sm">person_add</span>
                  </div>
                  <h2 className="font-headline-sm text-on-surface mb-1 text-sm font-bold">Registrar Artista</h2>
                  <p className="font-caption text-caption text-on-surface-variant text-[10px] leading-tight">Agrega talento nuevo.</p>
                </div>
                <div className="flex flex-col gap-2 w-full relative z-10 mt-auto">
                  <button onClick={() => setIsModalOpen(true)} className="w-full py-2 px-4 bg-primary text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors active:scale-95 duration-200 ease-in-out">
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Crear
                  </button>
                  <button onClick={handleSeedFakeUsers} className="w-full py-2 px-4 border border-outline-variant text-secondary font-label-md text-label-md rounded flex items-center justify-center gap-2 hover:bg-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200 ease-in-out">
                    <span className="material-symbols-outlined text-[16px]">science</span>
                    Demo
                  </button>
                </div>
              </div>

              {/* Metric 1 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Personas Actuales</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">group</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-3xl text-on-surface leading-none mb-1">{metrics.totalUsers}</div>
                  <div className="flex items-center gap-1 text-primary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                    <span>Activos</span>
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Tatuadores Pro</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-3xl text-on-surface leading-none mb-1">{metrics.monthlyUsers}</div>
                  <div className="flex items-center gap-1 text-primary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">stars</span>
                    <span>Mensual</span>
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Partners</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">handshake</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-3xl text-on-surface leading-none mb-1">{metrics.partnerUsers}</div>
                  <div className="flex items-center gap-1 text-primary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">verified_user</span>
                    <span>Vitalicios</span>
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">En Prueba</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-3xl text-on-surface leading-none mb-1">{metrics.trialUsers}</div>
                  <div className="flex items-center gap-1 text-secondary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">timer</span>
                    <span>Pendientes</span>
                  </div>
                </div>
              </div>`;
    content = content.substring(0, idxStart) + newGrid + content.substring(idxEnd);
} else {
    console.error("Zone 1 not found");
}

// Replace the specific user input with a select in blog section
const specificUserInputStr = `                  {blogTarget === 'specific' && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                      <label className="font-label-md text-label-md text-secondary">Nombre o Usuario</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Juan Pérez o @juanp" 
                        value={blogSpecificUser}
                        onChange={(e) => setBlogSpecificUser(e.target.value)}
                        className="w-full bg-deep-black border border-outline-variant/50 rounded p-3 text-on-surface focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>
                  )}`;

const specificUserSelectStr = `                  {blogTarget === 'specific' && (
                    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                      <label className="font-label-md text-label-md text-secondary">Seleccionar Usuario</label>
                      <select 
                        value={blogSpecificUser}
                        onChange={(e) => setBlogSpecificUser(e.target.value)}
                        className="w-full bg-deep-black border border-outline-variant/50 rounded p-3 text-on-surface focus:outline-none focus:border-primary transition-all"
                        required
                      >
                        <option value="">Selecciona un usuario...</option>
                        {users.map(u => (
                            <option key={u.uid} value={u.displayName || u.userTag || u.email}>
                                {u.displayName || u.userTag} ({u.email})
                            </option>
                        ))}
                      </select>
                    </div>
                  )}`;

content = content.replace(specificUserInputStr, specificUserSelectStr);

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
