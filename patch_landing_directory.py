import re

with open('src/components/Landing.tsx', 'r') as f:
    content = f.read()

fallback_photos_code = """
const fallbackPhotos = [
    {
      id: "fallback_1",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
      alt: "A highly detailed black and grey realism tattoo of a lion's face on a human forearm.",
      title: "Detailed black & grey realism",
      tags: ["Realismo", "Blackwork"]
    },
    {
      id: "fallback_2",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
      alt: "Close-up of a delicate minimalist tattoo of a single rose.",
      title: "Delicate minimalist single rose",
      tags: ["Minimalista"]
    },
    {
      id: "fallback_3",
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
      alt: "Large-scale blackwork tattoo covering a full back.",
      title: "Large-scale blackwork back piece",
      tags: ["Blackwork", "Tradicional"]
    }
];
"""

# Add carousel state if needed, but we can just use CSS animation or simple scroll snap for mobile.
# A simple scroll snap or CSS animation is lightweight. 
# CSS keyframes for auto carousel can be tricky, but we can use Framer Motion or just a simple interval in useEffect.
# The user wants "carrusel automático".
# Let's add state for active slide.
state_regex = r"const \[loginError, setLoginError\] = useState\(''\);"
state_replacement = """const [loginError, setLoginError] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % fallbackPhotos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);"""

content = re.sub(state_regex, state_replacement, content)
content = content.replace("export default function Landing() {", fallback_photos_code + "\nexport default function Landing() {")

# Replace Directorio Content
target = r"\{\/\* Featured Spotlight \*\/\}.*?</div>\n\s*</section>"
replacement = """{/* Featured Spotlight */}
            <div className="w-full bg-surface-variant rounded-2xl overflow-hidden neon-border mb-8 flex flex-col md:flex-row group cursor-pointer" onClick={() => navigate('/demo/profile')}>
              <div className="w-full md:w-2/3 h-[500px] relative overflow-hidden">
                <img alt="Victor Ink" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTy79SDu2NnHX_tAaMxoahcDiJ4pf7_nJmr7uTAAHM8nxqhJff5IC5kw81q-uy-DejCNoslPvxIxRoAS0kmUW2rRVGPoXENl4-mG4KeSHwaVkHpwH697MHIwve1I-TOLV4QpKI1kNS0rrInl2u5PHFRbN-LoP9GV-4VLjLN1CD4iioFFwkH1q7TvXKkvqwEs1r2ziFSscHLtIk_MG7mMjY-BXTPPEyDPKgvKExhYN8hJQbmQ4f_-PDUbakN5_n7OX29L7XqCB9a0E" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface-variant hidden md:block"></div>
              </div>
              <div className="w-full md:w-1/3 p-10 flex flex-col justify-center bg-surface-variant">
                <span className="text-primary uppercase tracking-[0.2em] font-bold text-sm mb-2">Artista Destacado (Demo)</span>
                <h3 className="text-4xl font-bold text-white mb-4">Victor Ink</h3>
                <p className="text-gray-400 mb-8">Blackwork / Minimalist. Creando piezas únicas con precisión y estética limpia. Explora la experiencia completa de nuestro software con esta cuenta de demostración.</p>
                <button className="px-8 py-3 border-2 border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Ver Perfil Demo</button>
              </div>
            </div>
            
            {/* Mobile Carousel & Desktop Grid */}
            <div className="block md:hidden relative w-full overflow-hidden rounded-2xl neon-border h-[450px]">
                <div className="flex w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
                   {fallbackPhotos.map((photo, idx) => (
                      <div key={photo.id} className="w-full h-full shrink-0 relative group">
                          <img alt={photo.alt} className="w-full h-full object-cover" src={photo.src} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6">
                              <h4 className="text-2xl font-bold text-white mb-2">{photo.title}</h4>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {photo.tags.map(tag => (
                                    <span key={tag} className="text-xs font-bold px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded uppercase tracking-widest">{tag}</span>
                                ))}
                              </div>
                              <div className="flex items-center gap-3 pt-4 border-t border-white/20">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTy79SDu2NnHX_tAaMxoahcDiJ4pf7_nJmr7uTAAHM8nxqhJff5IC5kw81q-uy-DejCNoslPvxIxRoAS0kmUW2rRVGPoXENl4-mG4KeSHwaVkHpwH697MHIwve1I-TOLV4QpKI1kNS0rrInl2u5PHFRbN-LoP9GV-4VLjLN1CD4iioFFwkH1q7TvXKkvqwEs1r2ziFSscHLtIk_MG7mMjY-BXTPPEyDPKgvKExhYN8hJQbmQ4f_-PDUbakN5_n7OX29L7XqCB9a0E" alt="Victor Ink" className="w-8 h-8 rounded-full border border-primary/50 object-cover" />
                                <span className="text-sm text-gray-300 font-bold">@victor_ink</span>
                              </div>
                          </div>
                      </div>
                   ))}
                </div>
                {/* Indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                    {fallbackPhotos.map((_, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full transition-all ${activeSlide === idx ? 'bg-primary w-6' : 'bg-white/50'}`}></div>
                    ))}
                </div>
            </div>

            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
              {fallbackPhotos.map((photo) => (
                  <div key={photo.id} className="relative group overflow-hidden rounded-2xl neon-border h-[400px]">
                    <img alt={photo.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={photo.src} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                      <h4 className="text-xl font-bold text-white mb-2">{photo.title}</h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {photo.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-primary/20 text-primary border border-primary/30 rounded uppercase tracking-widest">{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTy79SDu2NnHX_tAaMxoahcDiJ4pf7_nJmr7uTAAHM8nxqhJff5IC5kw81q-uy-DejCNoslPvxIxRoAS0kmUW2rRVGPoXENl4-mG4KeSHwaVkHpwH697MHIwve1I-TOLV4QpKI1kNS0rrInl2u5PHFRbN-LoP9GV-4VLjLN1CD4iioFFwkH1q7TvXKkvqwEs1r2ziFSscHLtIk_MG7mMjY-BXTPPEyDPKgvKExhYN8hJQbmQ4f_-PDUbakN5_n7OX29L7XqCB9a0E" alt="Victor Ink" className="w-6 h-6 rounded-full border border-primary/50 object-cover" />
                        <span className="text-xs text-gray-300 font-bold">@victor_ink</span>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>"""

content = re.sub(target, replacement, content, flags=re.DOTALL)

with open('src/components/Landing.tsx', 'w') as f:
    f.write(content)

