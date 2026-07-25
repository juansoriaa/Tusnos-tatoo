const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `                  Envíanos un mensaje a turnos.tatoo@gmail.com
                </p>
                <form 
                  className="flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    // Simulate sending logic, then update state
                    setTimeout(() => {
                      setContactSuccess(true);
                      setTimeout(() => {
                        setContactModalOpen(false);
                        setContactSuccess(false);
                        setContactForm({ name: '', email: '', message: '' });
                      }, 2500);
                    }, 500);
                  }}
                >
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Nombre</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-surface-container-highest border border-outline-variant/30 px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      required
                      className="w-full bg-surface-container-highest border border-outline-variant/30 px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-1">Mensaje</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-surface-container-highest border border-outline-variant/30 px-4 py-2 text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    ></textarea>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-3 bg-primary text-on-primary font-label-md uppercase font-bold hover:bg-[#065f46] transition-colors mt-2"
                  >
                    Enviar Mensaje
                  </button>
                </form>`;

const replacement = `                  Envíanos un mensaje a turnos.tatoo@gmail.com
                </p>
                <div className="flex flex-col gap-4 mt-2">
                  <p className="text-on-surface-variant text-sm mb-4">
                    Al hacer clic en el botón, se abrirá tu cliente de correo predeterminado para redactar un mensaje a nuestro equipo.
                  </p>
                  <a 
                    href="mailto:turnos.tatoo@gmail.com?subject=Consulta%20desde%20Turnos%20Tattoo"
                    className="w-full py-3 bg-primary text-on-primary font-label-md uppercase font-bold hover:bg-[#065f46] transition-colors text-center flex items-center justify-center gap-2"
                    onClick={() => setContactModalOpen(false)}
                  >
                    <span className="material-symbols-outlined">mail</span>
                    Abrir Correo
                  </a>
                </div>`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);

