const fs = require('fs');

let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

const stateCode = `  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);`;

content = content.replace(/  const \[loginError, setLoginError\] = useState\(''\);/, "  const [loginError, setLoginError] = useState('');\n" + stateCode);

const oldFooter = /\{\/\* Footer \*\/\}[\s\S]*?<\/footer>/;
const newFooter = `{/* Footer */}
      <footer className="w-full py-16 px-gutter flex flex-col items-center gap-8 text-center bg-surface-container-lowest border-t border-outline-variant/10 mt-8">
        <div className="flex flex-col items-center gap-6">
          <span className="font-headline-sm text-headline-sm text-on-surface font-extrabold uppercase tracking-tighter">Turnos <span className="text-primary">Tattoo</span></span>
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-4">
          <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setTermsModalOpen(true)}>Términos</button>
          <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setPrivacyModalOpen(true)}>Privacidad</button>
          <button className="font-caption text-caption uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors" onClick={() => setContactModalOpen(true)}>Contacto</button>
        </div>
        <p className="font-caption text-caption uppercase tracking-widest text-on-surface-variant opacity-60">© 2026 Turnos Tattoo. All rights reserved.</p>
      </footer>`;

content = content.replace(oldFooter, newFooter);

const modalsCode = `      {/* Terms Modal */}
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
                </div>
              </>
            )}
          </div>
        </div>
      )}`;

content = content.replace(/    <\/>\n  \);\n\}/, modalsCode + "\n    </>\n  );\n}");

fs.writeFileSync('src/components/Landing.tsx', content);
