const fs = require('fs');

let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const lines = content.split('\n');
const waitListIndex = lines.findIndex(l => l.includes('{/* Waiting List Section */}'));

if (waitListIndex !== -1) {
    const keepLines = lines.slice(0, waitListIndex);
    
    const newFaqSection = `                    {/* FAQ Editor Section */}
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
                </div>
            </div>
        </DemoLayout>
    );
}

export default DemoDashboard;`;
    
    const finalContent = keepLines.join('\n') + '\n' + newFaqSection;
    fs.writeFileSync('src/components/DemoDashboard.tsx', finalContent);
}

