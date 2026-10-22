import React from 'react';
import { OptimizedImage } from './OptimizedImage';
import { uploadToImgBB } from '../lib/imgbb';
import { db } from '../firebase';

interface ProfileSecondaryModalsProps {
  waitlistModalOpen: boolean;
  setWaitlistModalOpen: (v: boolean) => void;
  waitlistSuccess: boolean;
  setWaitlistSuccess: (v: boolean) => void;
  isSubmittingWaitlist: boolean;
  setIsSubmittingWaitlist: (v: boolean) => void;
  waitlistForm: any;
  setWaitlistForm: (v: any) => void;
  refTattoo: any;
  artistData: any;
  trackMetric: (metricKey: 'views' | 'photoClicks' | 'whatsappClicks' | 'agendaClicks', photoId?: string) => void;
  termsModalOpen: boolean;
  setTermsModalOpen: (v: boolean) => void;
  privacyModalOpen: boolean;
  setPrivacyModalOpen: (v: boolean) => void;
  contactModalOpen: boolean;
  setContactModalOpen: (v: boolean) => void;
  contactSuccess: boolean;
  setContactSuccess: (v: boolean) => void;
  setContactForm: (v: any) => void;
}

export default function ProfileSecondaryModals({
  waitlistModalOpen,
  setWaitlistModalOpen,
  waitlistSuccess,
  setWaitlistSuccess,
  isSubmittingWaitlist,
  setIsSubmittingWaitlist,
  waitlistForm,
  setWaitlistForm,
  refTattoo,
  artistData,
  trackMetric,
  termsModalOpen,
  setTermsModalOpen,
  privacyModalOpen,
  setPrivacyModalOpen,
  contactModalOpen,
  setContactModalOpen,
  contactSuccess,
  setContactSuccess,
  setContactForm,
}: ProfileSecondaryModalsProps) {
  return (
    <>
      {waitlistModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-md p-6 relative flex flex-col gap-4 overflow-hidden modal-container">
            <button
              type="button"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10"
              onClick={() => {
                setWaitlistModalOpen(false);
                setWaitlistForm({ ...waitlistForm, referenceImage: '' });
                setWaitlistSuccess(false);
              }}
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {waitlistSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4 animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-accent/20 flex items-center justify-center mb-2 animate-button-pop">
                  <span className="material-symbols-outlined text-4xl text-emerald-accent">check</span>
                </div>
                <h2 className="font-headline-md text-xl text-on-surface uppercase tracking-tighter">¡Mensaje Enviado!</h2>
                <p className="text-sm text-on-surface-variant text-center max-w-[280px]">
                  El tatuador ha recibido tu solicitud. Te contactará por WhatsApp a la brevedad.
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-headline-md text-xl text-on-surface uppercase tracking-tighter">Agéndate en la lista</h2>
                <p className="text-sm text-on-surface-variant bg-surface-variant/50 p-3 border border-outline-variant/30 rounded">
                  El tatuador se encuentra ocupado. Cuando se libere, te enviará un mensaje.
                </p>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Tu nombre</label>
                  <input
                    type="text"
                    placeholder="Ej. Juan Pérez"
                    className="modal-input bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full"
                    value={waitlistForm.name}
                    onChange={e => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Tu número de WhatsApp</label>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="11..."
                      className="modal-input bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full pr-10"
                      value={waitlistForm.phone}
                      onChange={e => setWaitlistForm({ ...waitlistForm, phone: e.target.value })}
                    />
                    {waitlistForm.phone.replace(/[^0-9]/g, '').length === 10 && (
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#b1efe2]">check_circle</span>
                    )}
                  </div>
                </div>
                {!waitlistForm.referenceImage && (
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Título (Consulta o Idea)</label>
                    <select
                      className="modal-input bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full cursor-pointer appearance-none"
                      value={waitlistForm.type}
                      onChange={e => setWaitlistForm({ ...waitlistForm, type: e.target.value })}
                    >
                      <option value="consulta">Consulta general</option>
                      <option value="idea">Tengo una idea</option>
                    </select>
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase">Descripción</label>
                  <textarea
                    rows={3}
                    placeholder="Describa su consulta o idea de tatuaje, tamaño y zona del cuerpo."
                    className="modal-input bg-deep-black border border-border-muted text-silver-text font-label-md py-3 px-4 focus:outline-none focus:border-emerald-accent w-full resize-none"
                    value={waitlistForm.description}
                    onChange={e => setWaitlistForm({ ...waitlistForm, description: e.target.value })}
                  ></textarea>
                </div>

                {waitlistForm.referenceImage ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="font-label-sm text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Tatuaje de referencia seleccionado</label>
                    <div className="flex gap-4 items-start bg-surface-variant/30 p-2 rounded border border-outline-variant/30">
                      <OptimizedImage highResUrl={waitlistForm.referenceImage || ""} alt="Referencia" className="w-20 h-20 object-cover rounded border border-border-muted shrink-0" useIntersectionObserver={true} />
                      <div className="flex flex-col gap-1.5 overflow-hidden justify-center h-full">
                        {refTattoo ? (
                          <>
                            <h4 className="text-sm font-bold text-on-surface truncate leading-tight">{refTattoo.title}</h4>
                            <div className="flex flex-wrap gap-1">
                              {refTattoo.categories.map((cat: string, idx: number) => (
                                <span key={idx} className="text-[9px] uppercase tracking-wider bg-surface-variant text-on-surface px-1.5 py-0.5 rounded border border-outline-variant/50">{cat}</span>
                              ))}
                            </div>
                            <p className="text-xs text-on-surface-variant line-clamp-2 leading-snug">{refTattoo.alt}</p>
                          </>
                        ) : (
                          <div className="flex flex-col gap-2">
                            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Imagen adjuntada</p>
                            <button
                              type="button"
                              className="text-[10px] uppercase tracking-wider text-error hover:text-error/80 text-left transition-colors font-bold flex items-center gap-1"
                              onClick={() => setWaitlistForm({ ...waitlistForm, referenceImage: '' })}
                            >
                              <span className="material-symbols-outlined text-sm">delete</span>
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mt-1">
                    <label className="cursor-pointer flex items-center gap-2 text-on-surface-variant hover:text-emerald-accent transition-colors">
                      <span className="material-symbols-outlined text-xl">image</span>
                      <span className="font-label-sm text-[10px] uppercase tracking-wider font-bold">Adjunta tu tatuaje de referencia</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            if (file.size > 10 * 1024 * 1024) {
                              alert('La imagen no puede pesar más de 10MB.');
                              return;
                            }
                            setIsSubmittingWaitlist(true);
                            try {
                              const res = await uploadToImgBB(file);
                              setWaitlistForm({ ...waitlistForm, referenceImage: res.url });
                            } catch (err) {
                              console.error(err);
                              alert('Error al adjuntar imagen.');
                            } finally {
                              setIsSubmittingWaitlist(false);
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                )}

                <button
                  type="button"
                  className="modal-submit-btn w-full py-3 mt-2 bg-emerald-accent text-on-surface font-label-md font-extrabold uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmittingWaitlist}
                  onClick={async () => {
                    if (isSubmittingWaitlist) return;
                    setIsSubmittingWaitlist(true);

                    try {
                      const newMessage = {
                        id: Date.now(),
                        name: waitlistForm.name || waitlistForm.phone || 'Sin nombre',
                        phone: waitlistForm.phone.replace(/[^0-9]/g, ''),
                        time: new Date().toISOString(),
                        title: waitlistForm.type === 'consulta' ? 'Consulta general' : 'Idea de tatuaje',
                        text: waitlistForm.description || 'Sin descripción',
                        hasImage: !!waitlistForm.referenceImage,
                        referenceImage: waitlistForm.referenceImage || null,
                        referenceTitle: waitlistForm.referenceImage ? (refTattoo?.title || 'Imagen adjuntada') : null,
                        tags: [
                          waitlistForm.type === 'consulta' ? 'Consulta' : 'Idea',
                          ...(waitlistForm.referenceImage ? [refTattoo ? 'Refe. del portafolio' : 'Refe. del usuario'] : []),
                        ],
                        type: 'Nueva solicitud',
                        typeClass: 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-border-muted whitespace-nowrap rounded',
                        read: false,
                      };

                      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
                      await addDoc(collection(db, 'users', artistData.uid, 'waitlist'), {
                        ...newMessage,
                        createdAt: serverTimestamp(),
                      });

                      trackMetric('agendaClicks');
                      setWaitlistSuccess(true);
                      setTimeout(() => {
                        setWaitlistModalOpen(false);
                        setWaitlistForm({ name: '', phone: '', type: 'consulta', description: '', referenceImage: '' });
                        setWaitlistSuccess(false);
                        setIsSubmittingWaitlist(false);
                      }, 2500);
                    } catch (error) {
                      console.error("Error sending waitlist message:", error);
                      setIsSubmittingWaitlist(false);
                    }
                  }}
                >
                  {isSubmittingWaitlist ? 'Enviando...' : 'Agendarme'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {termsModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" style={{ position: 'fixed' }}>
          <div className="bg-surface-container border border-outline-variant w-full max-w-2xl max-h-[80vh] flex flex-col p-6 relative overflow-hidden modal-container">
            <button
              type="button"
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
                type="button"
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
          <div className="bg-surface-container border border-outline-variant w-full max-w-2xl max-h-[80vh] flex flex-col p-6 relative overflow-hidden modal-container">
            <button
              type="button"
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
                type="button"
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
          <div className="bg-surface-container border border-outline-variant w-full max-w-md p-6 relative flex flex-col gap-4 overflow-hidden modal-container">
            <button
              type="button"
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white z-10"
              onClick={() => {
                setContactModalOpen(false);
                setContactSuccess(false);
                setContactForm({ name: '', phone: '', message: '' });
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
      )}
    </>
  );
}
