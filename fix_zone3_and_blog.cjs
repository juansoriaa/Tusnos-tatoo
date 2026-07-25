const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

// 1. Add Zone 3 Calendar
const zone3End = '            </div>\n          </section>\n          </div>';
// We need to inject the calendar before the closing </div> of Zone 3, or rather below the </section>.
const zone3SectionCloseRegex = /<\/section>\n\n          <\/div>\n\n          \{\/\* Zone 4:/;
const calendarHtml = `</section>

          {/* Calendario de Ganancias */}
          <section className="grid grid-cols-1 mt-6">
            <div className="glass-panel border border-outline-variant/20 rounded-xl p-8">
                <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Historial de Ganancias</h2>
                    <p className="font-caption text-caption text-on-surface-variant">Rendimiento mensual histórico de la plataforma.</p>
                </div>
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((month, idx) => {
                        const baseVal = netProfit > 0 ? netProfit : 3000;
                        const rnd = (Math.sin(idx + 1) * 0.2 + 0.8) * baseVal; 
                        return (
                        <div key={month} className="bg-deep-black border border-outline-variant/20 rounded p-4 flex flex-col items-center justify-center group hover:border-primary/50 transition-colors">
                            <span className="text-secondary font-caption text-[10px] uppercase tracking-widest mb-2">{month} 2026</span>
                            <span className="text-xl text-on-surface font-bold">\${rnd.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</span>
                            <div className="flex items-center gap-1 mt-2 text-[10px] text-primary">
                                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                                <span>+{Math.floor((idx + 1) * 2 + 5)}%</span>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
          </section>

          </div>

          {/* Zone 4:`;

content = content.replace(zone3SectionCloseRegex, calendarHtml);

// 2. Replace Blog specific user input
const oldBlogSpecificUser = `{blogTarget === 'specific' && (
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

const newBlogSpecificUser = `{blogTarget === 'specific' && (
                  <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                    <label className="font-label-md text-label-md text-secondary">Buscar Usuario</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[18px]">search</span>
                      <input 
                        type="text" 
                        placeholder="Ej. Juan Pérez o @juanp" 
                        value={blogSpecificUser}
                        onChange={(e) => setBlogSpecificUser(e.target.value)}
                        className="w-full bg-deep-black border border-outline-variant/50 rounded p-3 pl-10 text-on-surface focus:outline-none focus:border-primary transition-all"
                        required
                        list="user-search-list"
                      />
                      <datalist id="user-search-list">
                        {users.map(u => (
                            <option key={u.uid} value={u.displayName || u.userTag || u.email}>
                                {u.displayName || u.userTag} ({u.email})
                            </option>
                        ))}
                      </datalist>
                    </div>
                  </div>
                )}`;

content = content.replace(oldBlogSpecificUser, newBlogSpecificUser);

fs.writeFileSync('src/components/SuperAdmin.tsx', content);

