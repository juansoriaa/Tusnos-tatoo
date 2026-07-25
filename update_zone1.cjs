const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

const regex = /<div className="grid grid-cols-2 md:grid-cols-5 gap-4">[\s\S]*?<\/section>\n\n          <\/div>/;

const newGrid = `<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {/* Quick Action: Crear New */}
              <div className="col-span-2 md:col-span-2 lg:col-span-1 rounded-xl bg-gradient-to-br from-primary-container to-surface-container border border-outline-variant/30 p-4 flex flex-col justify-between relative overflow-hidden group hover:border-primary/50 transition-colors duration-300">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 mb-4">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-primary text-sm">person_add</span>
                  </div>
                  <h2 className="font-headline-sm text-on-surface mb-1 text-sm font-bold">Registrar</h2>
                  <p className="font-caption text-caption text-on-surface-variant text-[10px] leading-tight">Agrega talento.</p>
                </div>
                <div className="flex flex-col gap-2 w-full relative z-10 mt-auto">
                  <button onClick={() => setIsModalOpen(true)} className="w-full py-1.5 px-2 bg-primary text-on-primary font-label-md text-label-md rounded flex items-center justify-center gap-1 hover:bg-primary-fixed transition-colors active:scale-95 duration-200 ease-in-out">
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    Crear
                  </button>
                  <button onClick={handleSeedFakeUsers} className="w-full py-1.5 px-2 border border-outline-variant text-secondary font-label-md text-label-md rounded flex items-center justify-center gap-1 hover:bg-surface-variant hover:text-on-surface transition-colors active:scale-95 duration-200 ease-in-out">
                    <span className="material-symbols-outlined text-[14px]">science</span>
                    Demo
                  </button>
                </div>
              </div>

              {/* Metric 1 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Usuarios</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">group</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.totalUsers}</div>
                  <div className="flex items-center gap-1 text-primary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span>
                    <span>Registrados</span>
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
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.monthlyUsers}</div>
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
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.partnerUsers}</div>
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
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.trialUsers}</div>
                  <div className="flex items-center gap-1 text-secondary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">timer</span>
                    <span>Pendientes</span>
                  </div>
                </div>
              </div>

              {/* Metric 5 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Tiempo Real</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">podcasts</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1 text-primary">12</div>
                  <div className="flex items-center gap-1 text-primary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">sensors</span>
                    <span>Conectados</span>
                  </div>
                </div>
              </div>

              {/* Metric 6 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Externos</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">public</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{Math.max(0, metrics.totalUsers - (metrics.monthlyUsers + metrics.partnerUsers + metrics.trialUsers))}</div>
                  <div className="flex items-center gap-1 text-secondary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">person_outline</span>
                    <span>Clientes</span>
                  </div>
                </div>
              </div>

              {/* Metric 7 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">Activos</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">local_fire_department</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-2xl text-on-surface leading-none mb-1">{metrics.monthlyUsers + metrics.partnerUsers + metrics.trialUsers}</div>
                  <div className="flex items-center gap-1 text-secondary text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">draw</span>
                    <span>Tatuadores</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          </div>`;

content = content.replace(regex, newGrid);
fs.writeFileSync('src/components/SuperAdmin.tsx', content);
