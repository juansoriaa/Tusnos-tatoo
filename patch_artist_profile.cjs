const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const defaultFaqsStr = `
const defaultFaqs = [
  { question: '¿Qué tengo que hacer antes del tatuaje?', answer: 'Venir bien descansado, haber comido bien antes de la sesión y no consumir alcohol ni drogas 24 horas antes. Mantener la piel hidratada los días previos ayuda mucho.' },
  { question: '¿Qué hacer después?', answer: 'Lavar la zona con jabón neutro 2-3 veces al día, aplicar una capa muy fina de crema cicatrizante, no rascar, no exponer al sol directo y evitar piletas/mar por 15 días.' },
  { question: 'Recomendación del tatuador', answer: 'Confía en el proceso y en el diseño. Las mejores piezas surgen cuando hay libertad creativa para adaptar la idea a la anatomía de tu cuerpo.' },
  { question: '¿Duele tatuarse?', answer: 'El dolor es subjetivo y depende de la zona del cuerpo y la tolerancia de cada persona. Generalmente se siente como un rasguño constante, pero es totalmente soportable.' }
];
`;

content = content.replace(/const ArtistProfile: React\.FC = \(\) => \{/, defaultFaqsStr + "\nconst ArtistProfile: React.FC = () => {");

const faqStart = content.indexOf('{/* FAQ Section */}');
// find end of FAQ section (before {/* Footer */})
const faqEnd = content.indexOf('{/* Footer */}');

const newFaqHtml = `{/* FAQ Section */}
        <section className="mt-section-gap px-gutter max-w-container-max mx-auto -mt-16 md:-mt-24">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-8 font-bold uppercase tracking-tight text-center">Preguntas Frecuentes</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {(artistData?.faqs || defaultFaqs).map((faq: any, index: number) => (
                <details key={index} className="bg-surface-container border border-outline-variant/30 group">
                <summary className="font-label-md text-on-surface uppercase font-bold p-6 cursor-pointer flex justify-between items-center list-none">
                    {faq.question}
                    <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="p-6 pt-0 text-on-surface-variant font-body-md">
                    <p>{faq.answer}</p>
                </div>
                </details>
            ))}
          </div>
        </section>

        `;

if (faqStart !== -1 && faqEnd !== -1) {
    content = content.substring(0, faqStart) + newFaqHtml + content.substring(faqEnd);
}

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
