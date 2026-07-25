const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

// ZONE 1 UPDATE (Bento Grid)
const oldZone1 = `            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Quick Action: Crear New */}
              <div className="md:col-span-1 rounded-xl bg-gradient-to-br from-primary-container to-surface-container border border-outline-variant/30 p-6 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 mb-8">
                  <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-primary text-xl">person_add</span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-1">Registrar Artista</h2>
                  <p className="font-caption text-caption text-on-surface-variant">Manually provision new talent to the network.</p>
                </div>
                <div className="flex flex-col gap-2 w-full relative z-10">
                  <button onClick={() => setIsModalOpen(true)} className="w-full py-3 px-4 bg-primary text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors active:scale-95 duration-200 ease-in-out">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Crear Profile
                  </button>
                  <button onClick={handleSeedFakeUsers} className="w-full py-2 px-4 border border-outline-variant text-secondary font-label-md text-label-md rounded flex items-center justify-center gap-2 hover:bg-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200 ease-in-out">
                    <span className="material-symbols-outlined text-[18px]">science</span>
                    Demo Data
                  </button>
                </div>
              </div>

              {/* Metric 1 */}
              <div className="glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-caption text-caption text-secondary uppercase tracking-widest">Artistas Totales</span>
                  <span className="material-symbols-outlined text-secondary text-[20px]">hub</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-display-lg-mobile text-on-surface leading-none mb-2">{metrics.totalUsers}</div>
                  <div className="flex items-center gap-1 text-primary font-caption text-caption">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>Red Activa</span>
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-caption text-caption text-secondary uppercase tracking-widest">Renovaciones Activas</span>
                  <span className="material-symbols-outlined text-secondary text-[20px]">autorenew</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-display-lg-mobile text-on-surface leading-none mb-2">{metrics.monthlyUsers}</div>
                  <div className="flex items-center gap-1 text-primary font-caption text-caption">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span>
                    <span>Ciclos Mensuales</span>
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="glass-panel border border-outline-variant/20 rounded-xl p-6 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-caption text-caption text-secondary uppercase tracking-widest">Atención Requerida</span>
                  <span className="material-symbols-outlined text-secondary text-[20px]">warning</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-display-lg-mobile text-error leading-none mb-2">{metrics.trialUsers}</div>
                  <div className="flex items-center gap-1 text-error font-caption text-caption">
                    <span className="material-symbols-outlined text-[14px]">timer</span>
                    <span>Trials activos</span>
                  </div>
                </div>
              </div>
            </div>`;

const newZone1 = `            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Quick Action: Crear New */}
              <div className="col-span-2 md:col-span-1 rounded-xl bg-gradient-to-br from-primary-container to-surface-container border border-outline-variant/30 p-6 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 mb-4">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-primary text-sm">person_add</span>
                  </div>
                  <h2 className="font-headline-sm text-on-surface mb-1">Registrar Artista</h2>
                  <p className="font-caption text-caption text-on-surface-variant">Agrega talento nuevo.</p>
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
                    <span>Vitalicio</span>
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Trials</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">schedule</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-3xl text-on-surface leading-none mb-1">{metrics.trialUsers}</div>
                  <div className="flex items-center gap-1 text-secondary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">timer</span>
                    <span>Pruebas</span>
                  </div>
                </div>
              </div>
            </div>`;

content = content.replace(oldZone1, newZone1);

// ZONE 2 HEADER (Search Bar)
const oldZone2Header = `                <div className="flex justify-between items-end mb-6">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Gestión de Renovaciones</h2>
                    <p className="font-caption text-caption text-on-surface-variant">Acción requerida para ciclos de facturación próximos.</p>
                  </div>
                  <select 
                    value={renewalFilter}
                    onChange={(e) => setRenewalFilter(e.target.value as any)}
                    className="bg-deep-black border border-outline-variant/50 rounded text-caption text-secondary p-1 outline-none"
                  >
                    <option value="all">Todos</option>
                    <option value="trial">Trials</option>
                    <option value="monthly">Mensual</option>
                    <option value="partner">Partners</option>
                    <option value="expiring">Por Expirar / Expirados</option>
                  </select>
                </div>`;

const newZone2Header = `                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Gestión de Renovaciones</h2>
                    <p className="font-caption text-caption text-on-surface-variant">Acción requerida para ciclos de facturación próximos.</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 w-full md:w-auto">
                    <div className="flex items-center bg-deep-black border border-outline-variant/50 rounded px-2 w-full md:w-auto h-[34px]">
                      <span className="material-symbols-outlined text-secondary text-[16px]">search</span>
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre o usuario..." 
                        value={renewalSearchTerm}
                        onChange={(e) => setRenewalSearchTerm(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-on-surface p-1 w-full"
                      />
                    </div>
                    <select 
                      value={renewalFilter}
                      onChange={(e) => setRenewalFilter(e.target.value as any)}
                      className="bg-deep-black border border-outline-variant/50 rounded text-sm text-secondary p-1 h-[34px] outline-none"
                    >
                      <option value="all">Todos</option>
                      <option value="trial">Trials</option>
                      <option value="monthly">Mensual</option>
                      <option value="partner">Partners</option>
                      <option value="expiring">Por Expirar / Expirados</option>
                    </select>
                  </div>
                </div>`;

content = content.replace(oldZone2Header, newZone2Header);

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
