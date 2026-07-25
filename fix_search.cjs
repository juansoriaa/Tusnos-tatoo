const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

const regex = /<div className="flex justify-between items-center mb-6">[\s\S]*?<select[\s\S]*?<\/select>\n\s*<\/div>/;

const newSearchHtml = `<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface">Gestión de Renovaciones</h2>
                  <p className="font-caption text-caption text-on-surface-variant">Acción requerida para ciclos de facturación próximos.</p>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-48">
                      <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-secondary text-[16px]">search</span>
                      <input
                        type="text"
                        placeholder="Buscar usuario..."
                        value={renewalSearchTerm}
                        onChange={(e) => setRenewalSearchTerm(e.target.value)}
                        className="bg-deep-black border border-outline-variant/50 rounded text-caption text-on-surface p-2 pl-8 outline-none w-full focus:border-primary transition-colors"
                      />
                    </div>
                    <select 
                      value={renewalFilter}
                      onChange={(e) => setRenewalFilter(e.target.value as any)}
                      className="bg-deep-black border border-outline-variant/50 rounded text-caption text-secondary p-2 outline-none h-full shrink-0"
                    >
                      <option value="all">Todos</option>
                      <option value="trial">Trials</option>
                      <option value="monthly">Mensual</option>
                      <option value="partner">Partners</option>
                      <option value="expiring">Próximos</option>
                    </select>
                </div>
              </div>`;

content = content.replace(regex, newSearchHtml);
fs.writeFileSync('src/components/SuperAdmin.tsx', content);

