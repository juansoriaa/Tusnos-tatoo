const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const defaultFaqsStr = `
const defaultFaqs = [
  { question: '¿Qué tengo que hacer antes del tatuaje?', answer: 'Venir bien descansado, haber comido bien antes de la sesión y no consumir alcohol ni drogas 24 horas antes. Mantener la piel hidratada los días previos ayuda mucho.' },
  { question: '¿Qué hacer después?', answer: 'Lavar la zona con jabón neutro 2-3 veces al día, aplicar una capa muy fina de crema cicatrizante, no rascar, no exponer al sol directo y evitar piletas/mar por 15 días.' },
  { question: 'Recomendación del tatuador', answer: 'Confía en el proceso y en el diseño. Las mejores piezas surgen cuando hay libertad creativa para adaptar la idea a la anatomía de tu cuerpo.' },
  { question: '¿Duele tatuarse?', answer: 'El dolor es subjetivo y depende de la zona del cuerpo y la tolerancia de cada persona. Generalmente se siente como un rasguño constante, pero es totalmente soportable.' }
];
`;

content = content.replace(/    const \[isAvailable, setIsAvailable\] = useState\(true\);/, defaultFaqsStr + "\n    const [faqs, setFaqs] = useState(defaultFaqs);\n    const [isAvailable, setIsAvailable] = useState(true);");

content = content.replace(/                setStudioAddress\(data\.studioAddress \|\| ''\);/, "                setStudioAddress(data.studioAddress || '');\n                if (data.faqs) setFaqs(data.faqs);");

const saveFaqsFn = `
    const handleSaveFaqs = () => {
        try {
            const saved = localStorage.getItem('demoArtistData');
            let data = saved ? JSON.parse(saved) : {};
            data.faqs = faqs;
            localStorage.setItem('demoArtistData', JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('profileDataChanged'));
            alert("FAQs guardadas exitosamente!");
        } catch(err) {
            console.error(err);
        }
    };
`;

content = content.replace(/    const handleImageUpload = \(e: React\.ChangeEvent<HTMLInputElement>, type: 'avatar' \| 'banner'\) => \{/, saveFaqsFn + "\n    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {");

const metricsStart = content.indexOf('{/* Metrics Section: Shrunk to be more compact */}');
const profileConfigStart = content.indexOf('{/* Profile Config Section */}');

if (metricsStart !== -1 && profileConfigStart !== -1) {
    content = content.substring(0, metricsStart) + content.substring(profileConfigStart);
}

const waitListStart = content.indexOf('{/* Waiting List Section */}');
// find the end of waiting list section. It ends right before `</div>\n            </div>\n        </DemoLayout>`
const layoutEnd = content.indexOf('                </div>\n            </div>\n        </DemoLayout>');

const faqHtml = `                    {/* FAQ Editor Section */}
                    <section className="space-y-6">
                        <div className="bg-surface-container p-6 border border-outline-variant/10 flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary" style={{color: '#054d44'}}>quiz</span>
                                    <h3 className="font-headline-md text-lg uppercase tracking-tight">Preguntas Frecuentes</h3>
                                </div>
                                <button 
                                    onClick={() => setFaqs([...faqs, { question: 'Nueva pregunta', answer: 'Nueva respuesta' }])}
                                    className="bg-primary/10 hover:bg-primary/20 text-primary transition-colors rounded-full p-2 flex items-center justify-center"
                                    style={{color: '#054d44'}}
                                >
                                    <span className="material-symbols-outlined">add</span>
                                </button>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                {faqs.map((faq, index) => (
                                    <details key={index} className="bg-surface-container-high border border-outline-variant/30 group">
                                        <summary className="font-label-md text-on-surface uppercase font-bold p-4 cursor-pointer flex justify-between items-center list-none">
                                            <input 
                                                type="text" 
                                                value={faq.question}
                                                onChange={(e) => {
                                                    const newFaqs = [...faqs];
                                                    newFaqs[index].question = e.target.value;
                                                    setFaqs(newFaqs);
                                                }}
                                                className="bg-transparent border-b border-transparent hover:border-outline-variant focus:border-primary outline-none flex-grow mr-4 text-sm"
                                                onClick={(e) => e.preventDefault()}
                                            />
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const newFaqs = faqs.filter((_, i) => i !== index);
                                                        setFaqs(newFaqs);
                                                    }}
                                                    className="text-error hover:bg-error/10 p-1 rounded transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                                <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                                            </div>
                                        </summary>
                                        <div className="p-4 pt-0">
                                            <textarea 
                                                value={faq.answer}
                                                onChange={(e) => {
                                                    const newFaqs = [...faqs];
                                                    newFaqs[index].answer = e.target.value;
                                                    setFaqs(newFaqs);
                                                }}
                                                className="w-full bg-surface-container-lowest border border-outline-variant/30 p-3 text-on-surface-variant font-body-md text-sm outline-none focus:border-primary min-h-[100px] resize-y"
                                                placeholder="Escribe la respuesta aquí..."
                                            />
                                        </div>
                                    </details>
                                ))}
                            </div>
                            
                            <button 
                                onClick={handleSaveFaqs}
                                className="mt-6 w-full py-4 border border-outline-variant/30 text-xs font-bold uppercase tracking-widest hover:bg-surface-container-highest transition-colors active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span> Guardar FAQs
                            </button>
                        </div>
                    </section>
`;

if (waitListStart !== -1 && layoutEnd !== -1) {
    content = content.substring(0, waitListStart) + faqHtml + content.substring(layoutEnd);
}

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
