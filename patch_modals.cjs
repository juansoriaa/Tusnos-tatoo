const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `    </div>
  );
}`;

const replacement = `      {/* Terms Modal */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-2xl max-h-[80vh] flex flex-col p-6 relative overflow-hidden">
            <button 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10"
              onClick={() => setTermsModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-4 shrink-0">Términos y Condiciones</h3>
            <div className="overflow-y-auto pr-2 flex-1 hide-scrollbar">
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                Bienvenido a Turnos Tattoo. Al utilizar nuestros servicios, usted acepta estos términos y condiciones en su totalidad. No utilice Turnos Tattoo si no acepta todos los términos y condiciones establecidos en esta página.
              </p>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                <strong>Reservas y Turnos:</strong> Todas las reservas están sujetas a disponibilidad y requieren confirmación por parte del artista. En algunos casos, puede ser necesario un depósito no reembolsable para asegurar la cita. Las cancelaciones deben realizarse con al menos 48 horas de anticipación para poder reprogramar sin penalización.
              </p>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                <strong>Diseños:</strong> Los diseños de los tatuajes son propiedad intelectual del artista. El artista se reserva el derecho de modificar el diseño para asegurar un mejor resultado en la piel, previa consulta con el cliente.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                <strong>Cuidado Posterior:</strong> Es responsabilidad exclusiva del cliente seguir las instrucciones de cuidado posterior proporcionadas por el artista. Turnos Tattoo y sus artistas no se hacen responsables de infecciones u otros problemas derivados de un cuidado inadecuado.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/10 shrink-0">
              <button 
                className="w-full py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md uppercase font-bold transition-colors"
                onClick={() => setTermsModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-2xl max-h-[80vh] flex flex-col p-6 relative overflow-hidden">
            <button 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10"
              onClick={() => setPrivacyModalOpen(false)}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-4 shrink-0">Política de Privacidad</h3>
            <div className="overflow-y-auto pr-2 flex-1 hide-scrollbar">
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                En Turnos Tattoo respetamos su privacidad y estamos comprometidos a proteger la información personal que nos proporciona. Esta política explica cómo recopilamos, usamos y salvaguardamos su información.
              </p>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                <strong>Información que Recopilamos:</strong> Podemos solicitar información personal como su nombre, número de teléfono, dirección de correo electrónico y detalles médicos relevantes cuando realiza una consulta, reserva un turno o interactúa con nuestros servicios.
              </p>
              <p className="text-on-surface-variant mb-4 leading-relaxed">
                <strong>Uso de la Información:</strong> Utilizamos su información para gestionar sus reservas, comunicarnos con usted acerca de su cita, proporcionarle información sobre nuestros servicios y garantizar que su experiencia de tatuaje sea segura y personalizada.
              </p>
              <p className="text-on-surface-variant leading-relaxed">
                <strong>Protección de Datos:</strong> Implementamos medidas de seguridad para mantener la confidencialidad de su información. No vendemos, intercambiamos ni transferimos a terceros su información personal identificable sin su consentimiento previo.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/10 shrink-0">
              <button 
                className="w-full py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-md uppercase font-bold transition-colors"
                onClick={() => setPrivacyModalOpen(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-md p-6 relative flex flex-col gap-4 overflow-hidden">
            <button 
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10"
              onClick={() => {
                setContactModalOpen(false);
                setContactSuccess(false);
                setContactForm({ name: '', email: '', message: '' });
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-2">Contacto</h3>
            
            {contactSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
                </div>
                <h4 className="text-xl font-bold text-on-surface">¡Mensaje Enviado!</h4>
                <p className="text-on-surface-variant text-sm">Nos pondremos en contacto contigo a la brevedad.</p>
              </div>
            ) : (
              <>
                <p className="text-on-surface-variant text-sm mb-2">
                  Envíanos un mensaje a turnos.tatoo@gmail.com
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
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);

