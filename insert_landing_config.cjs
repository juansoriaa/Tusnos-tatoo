const fs = require('fs');
let code = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

const landingSection = `
          {/* Landing Page Images Config */}
          <section className="mb-gutter bg-surface-container rounded-2xl border border-outline-variant/30 p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary text-xl">imagesmode</span>
              <h3 className="font-headline-sm text-lg text-on-surface tracking-tight">Imágenes de Landing Page</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Lista de Espera */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest">Lista de Espera Inteligente</label>
                <input 
                  type="text" 
                  value={globalConfig?.landingImages?.waitlist || ''}
                  onChange={(e) => setGlobalConfig({...globalConfig, landingImages: {...(globalConfig.landingImages || {}), waitlist: e.target.value}})}
                  className="bg-deep-black border border-outline-variant/30 rounded p-2 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="URL de la imagen (ej: https://...)"
                />
                {globalConfig?.landingImages?.waitlist && (
                  <div className="mt-2 aspect-video bg-deep-black rounded border border-outline-variant/20 overflow-hidden">
                    <img src={globalConfig.landingImages.waitlist} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Métricas Avanzadas */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest">Métricas Avanzadas</label>
                <input 
                  type="text" 
                  value={globalConfig?.landingImages?.metrics || ''}
                  onChange={(e) => setGlobalConfig({...globalConfig, landingImages: {...(globalConfig.landingImages || {}), metrics: e.target.value}})}
                  className="bg-deep-black border border-outline-variant/30 rounded p-2 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="URL de la imagen (ej: https://...)"
                />
                {globalConfig?.landingImages?.metrics && (
                  <div className="mt-2 aspect-video bg-deep-black rounded border border-outline-variant/20 overflow-hidden">
                    <img src={globalConfig.landingImages.metrics} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Diseño Inteligente */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest">Diseño Inteligente</label>
                <input 
                  type="text" 
                  value={globalConfig?.landingImages?.design || ''}
                  onChange={(e) => setGlobalConfig({...globalConfig, landingImages: {...(globalConfig.landingImages || {}), design: e.target.value}})}
                  className="bg-deep-black border border-outline-variant/30 rounded p-2 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                  placeholder="URL de la imagen (ej: https://...)"
                />
                {globalConfig?.landingImages?.design && (
                  <div className="mt-2 aspect-video bg-deep-black rounded border border-outline-variant/20 overflow-hidden">
                    <img src={globalConfig.landingImages.design} className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleSaveConfig}
                disabled={isSavingConfig}
                className="bg-primary text-on-primary px-6 py-2 rounded font-bold text-sm hover:bg-primary-container transition-colors disabled:opacity-50"
              >
                {isSavingConfig ? 'Guardando...' : 'Guardar Imágenes'}
              </button>
            </div>
          </section>
`;

code = code.replace(
    '          {/* Zone 2: Supervisión de Rendimiento */}',
    landingSection + '\n          {/* Zone 2: Supervisión de Rendimiento */}'
);

fs.writeFileSync('src/components/SuperAdmin.tsx', code);
