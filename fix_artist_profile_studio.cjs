const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const targetStudio = `{/* Studio Location Section */}
        <section className="mt-section-gap px-gutter max-w-container-max mx-auto -mt-16 md:-mt-24">
          <div className="grid gap-12 items-center">
            <div className="text-center w-full">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4 font-bold uppercase tracking-tight">El Estudio</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Ubicado en el corazón del distrito de diseño, nuestro espacio combina la precisión técnica con una atmósfera de galería de arte.</p>
              <div className="space-y-6 flex flex-col items-center">
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="text-center">
                    <p className="font-label-md text-on-surface uppercase font-bold">Dirección</p>
                    <p className="text-on-surface-variant">Calle del Arte 1234, Palermo, CABA</p>
                  </div>
                  <span className="material-symbols-outlined text-primary">location_on</span>
                </div>
                <div className="flex flex-col items-center w-full gap-2">
                  <div className="text-center">
                    <p className="font-label-md text-on-surface uppercase font-bold">Horarios</p>
                    <p className="text-on-surface-variant">Mar - Sáb: 12:00 - 20:00</p>
                  </div>
                  <span className="material-symbols-outlined text-primary">schedule</span>
                </div>
              </div>
            </div>
            
            <div className="h-48 md:h-64 w-full mx-auto grayscale border border-outline-variant overflow-hidden">
              <div className="w-full h-full bg-surface-container flex items-center justify-center relative">
                <img className="absolute inset-0 w-full h-full object-cover opacity-30" alt="Palermo map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1MG2dFZwUDUPDIxG_Aln6x7qj7PTFU-nq71Kz_QrgZTsCKbHPWFjx1ECNLxh36R0plsldSaxtyWi1PPUfx4GZVICAiwQXgKFS91w9QB5JPN2AUgGXuwSqPAQHVv_Rrra-Rqlu99MtTqyjx4iIJbH0Xe-XAk9kQyS0DhXbqymKwhMbLjhlxQ9vs6vSgvupRUsYJkHkoWe_Sp9AOCXN0tXfooiYuXTp3PQK0-nvaoIExJsH7e4H5n1iynsgSXS0Bc702RScJbs0uf8" />
                <div className="relative z-10 text-center p-6 border border-primary/30 bg-surface/80 backdrop-blur-md">
                  <span className="material-symbols-outlined text-3xl text-primary mb-2">map</span>
                  <p className="font-label-md text-label-md text-on-surface font-bold">Mapa Interactivo</p>
                </div>
              </div>
            </div>
          </div>
        </section>`;

const replaceStudio = `{/* Studio Location Section */}
        {artistData?.hasPhysicalStudio !== false && (
          <section className="mt-section-gap px-gutter max-w-container-max mx-auto -mt-16 md:-mt-24">
            <div className="grid gap-12 items-center">
              <div className="text-center w-full">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4 font-bold uppercase tracking-tight">{artistData?.studioName || "El Estudio"}</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">{artistData?.studioDescription || "Ubicado en el corazón del distrito de diseño, nuestro espacio combina la precisión técnica con una atmósfera de galería de arte."}</p>
                <div className="space-y-6 flex flex-col items-center">
                  <div className="flex flex-col items-center w-full gap-2">
                    <div className="text-center">
                      <p className="font-label-md text-on-surface uppercase font-bold">Dirección</p>
                      <p className="text-on-surface-variant">{artistData?.studioAddress || "Calle del Arte 1234, Palermo, CABA"}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary">location_on</span>
                  </div>
                  <div className="flex flex-col items-center w-full gap-2">
                    <div className="text-center">
                      <p className="font-label-md text-on-surface uppercase font-bold">Horarios</p>
                      <p className="text-on-surface-variant">{artistData?.studioHours || "Mar - Sáb: 12:00 - 20:00"}</p>
                    </div>
                    <span className="material-symbols-outlined text-primary">schedule</span>
                  </div>
                </div>
              </div>
              
              <a 
                href={artistData?.mapLink || "https://maps.google.com"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-48 md:h-64 w-full mx-auto grayscale border border-outline-variant overflow-hidden hover:grayscale-0 hover:border-primary transition-all duration-500 block relative group"
              >
                <div className="w-full h-full bg-surface-container flex items-center justify-center relative">
                  <img className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-500" alt="Map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1MG2dFZwUDUPDIxG_Aln6x7qj7PTFU-nq71Kz_QrgZTsCKbHPWFjx1ECNLxh36R0plsldSaxtyWi1PPUfx4GZVICAiwQXgKFS91w9QB5JPN2AUgGXuwSqPAQHVv_Rrra-Rqlu99MtTqyjx4iIJbH0Xe-XAk9kQyS0DhXbqymKwhMbLjhlxQ9vs6vSgvupRUsYJkHkoWe_Sp9AOCXN0tXfooiYuXTp3PQK0-nvaoIExJsH7e4H5n1iynsgSXS0Bc702RScJbs0uf8" />
                  <div className="relative z-10 text-center p-6 border border-primary/30 bg-surface/80 backdrop-blur-md group-hover:bg-primary/90 group-hover:border-primary group-hover:text-on-primary transition-all duration-300">
                    <span className="material-symbols-outlined text-3xl text-primary mb-2 group-hover:text-on-primary transition-colors">map</span>
                    <p className="font-label-md text-label-md text-on-surface font-bold group-hover:text-on-primary transition-colors">Abrir en Google Maps</p>
                  </div>
                </div>
              </a>
            </div>
          </section>
        )}`;

content = content.replace(targetStudio, replaceStudio);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
