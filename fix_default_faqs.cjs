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

if (!content.includes('const defaultFaqs')) {
    content = content.replace("export default function Profile() {", defaultFaqsStr + "\nexport default function Profile() {");
    fs.writeFileSync('src/components/ArtistProfile.tsx', content);
}

