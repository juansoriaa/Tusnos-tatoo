const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const DEFAULT_BIO = "Especialista en realismo con 10 a\u00F1os de trayectoria. Mi enfoque se centra en crear piezas \u00FAnicas que cuenten una historia a trav\u00E9s del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte dise\u00F1ada espec\u00EDficamente para la anatom\u00EDa y visi\u00F3n del cliente.";

// 1. applyData & syncFromStorage (setBio)
file = file.replace(/setBio\(data\.bio \|\| ''\);/g, `setBio(data.bio || "${DEFAULT_BIO}");`);

// 2. applyData & syncFromStorage (specialtyTags)
// This appears a few times, we can just replace the whole block if we find it
const oldSpecialty1 = `setSpecialty1((data.specialtyTags && data.specialtyTags.length > 0) ? (data.specialtyTags[0] || '') : '');`;
const oldSpecialty2 = `setSpecialty2((data.specialtyTags && data.specialtyTags.length > 1) ? (data.specialtyTags[1] || '') : '');`;
const oldSpecialty3 = `setSpecialty3(data.specialtyTags?.[2] || '');`;

file = file.replace(new RegExp(oldSpecialty1.replace(/[.*+?^$\{type}()|[\\]\\\\]/g, '\\\\$&'), 'g'), `const defaultTags = ['Realismo', 'Black & Grey'];\n                  const currentTags = (data.specialtyTags && data.specialtyTags.length > 0) ? data.specialtyTags : defaultTags;\n                  setSpecialty1(currentTags[0] || '');`);
file = file.replace(new RegExp(oldSpecialty2.replace(/[.*+?^$\{type}()|[\\]\\\\]/g, '\\\\$&'), 'g'), `setSpecialty2(currentTags[1] || '');`);
file = file.replace(new RegExp(oldSpecialty3.replace(/[.*+?^$\{type}()|[\\]\\\\]/g, '\\\\$&'), 'g'), `setSpecialty3(currentTags[2] || '');`);

// There is also a slightly different version in syncFromStorage:
const oldSync1 = `setSpecialty1((data.specialtyTags && data.specialtyTags.length > 0) ? data.specialtyTags[0] : '');`;
const oldSync2 = `setSpecialty2((data.specialtyTags && data.specialtyTags.length > 1) ? data.specialtyTags[1] : '');`;

file = file.replace(new RegExp(oldSync1.replace(/[.*+?^$\{type}()|[\\]\\\\]/g, '\\\\$&'), 'g'), `const currentTags = (data.specialtyTags && data.specialtyTags.length > 0) ? data.specialtyTags : ['Realismo', 'Black & Grey'];\n                          setSpecialty1(currentTags[0] || '');`);
file = file.replace(new RegExp(oldSync2.replace(/[.*+?^$\{type}()|[\\]\\\\]/g, '\\\\$&'), 'g'), `setSpecialty2(currentTags[1] || '');`);

// 3. useState
file = file.replace(/const \[bio, setBio\] = useState\(initDataCache\.bio \|\| ''\);/g, `const [bio, setBio] = useState(initDataCache.bio || "${DEFAULT_BIO}");`);

const oldState1 = `const [specialty1, setSpecialty1] = useState((initDataCache.specialtyTags && initDataCache.specialtyTags.length > 0) ? initDataCache.specialtyTags[0] : '');`;
const oldState2 = `const [specialty2, setSpecialty2] = useState((initDataCache.specialtyTags && initDataCache.specialtyTags.length > 1) ? initDataCache.specialtyTags[1] : '');`;
const oldState3 = `const [specialty3, setSpecialty3] = useState(initDataCache.specialtyTags?.[2] || '');`;

file = file.replace(oldState1, `const _defaultTagsState = (initDataCache.specialtyTags && initDataCache.specialtyTags.length > 0) ? initDataCache.specialtyTags : ['Realismo', 'Black & Grey'];\n    const [specialty1, setSpecialty1] = useState(_defaultTagsState[0] || '');`);
file = file.replace(oldState2, `const [specialty2, setSpecialty2] = useState(_defaultTagsState[1] || '');`);
file = file.replace(oldState3, `const [specialty3, setSpecialty3] = useState(_defaultTagsState[2] || '');`);

// 4. InitialDataStr
file = file.replace(/bio: data\.bio \|\| '',/g, `bio: data.bio || "${DEFAULT_BIO}",`);
file = file.replace(/bio: '',/g, `bio: "${DEFAULT_BIO}",`);

fs.writeFileSync('src/components/DemoDashboard.tsx', file);
console.log("Patched defaults!");
