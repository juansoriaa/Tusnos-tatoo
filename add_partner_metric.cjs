const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

const trialMetric = `              {/* Metric 3 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-caption text-caption text-secondary uppercase tracking-widest">Usuarios en Prueba</span>
                  <span className="material-symbols-outlined text-secondary text-[20px]">hourglass_empty</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-display-lg-mobile text-on-surface leading-none mb-2">{metrics.trialUsers}</div>
                  <div className="flex items-center gap-1 text-on-surface-variant font-caption text-caption">
                    <span className="material-symbols-outlined text-[14px]">trending_flat</span>
                    <span>Conversión Pendiente</span>
                  </div>
                </div>
              </div>`;

const newMetrics = `              {/* Metric 3 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-caption text-caption text-secondary uppercase tracking-widest leading-tight">Partners</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">handshake</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-display-lg-mobile text-on-surface leading-none mb-2">{metrics.partnerUsers}</div>
                  <div className="flex items-center gap-1 text-primary font-caption text-caption">
                    <span className="material-symbols-outlined text-[14px]">verified_user</span>
                    <span>Vitalicios</span>
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="col-span-1 glass-panel border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between group hover:bg-surface-container-low transition-colors duration-200">
                <div className="flex justify-between items-start mb-6">
                  <span className="font-caption text-[10px] text-secondary uppercase tracking-widest leading-tight">En Prueba</span>
                  <span className="material-symbols-outlined text-secondary text-[16px]">hourglass_empty</span>
                </div>
                <div>
                  <div className="font-display-lg-mobile text-display-lg-mobile text-on-surface leading-none mb-2">{metrics.trialUsers}</div>
                  <div className="flex items-center gap-1 text-on-surface-variant font-caption text-[10px]">
                    <span className="material-symbols-outlined text-[12px]">trending_flat</span>
                    <span>Pendientes</span>
                  </div>
                </div>
              </div>`;

content = content.replace(trialMetric, newMetrics);
fs.writeFileSync('src/components/SuperAdmin.tsx', content);
