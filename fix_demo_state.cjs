const fs = require('fs');
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const targetState = `    const [isAvailable, setIsAvailable] = useState(true);
    const [modalOpen, setModalOpen] = useState<string | null>(null);`;

const newState = `    const [isAvailable, setIsAvailable] = useState(true);
    const [modalOpen, setModalOpen] = useState<string | null>(null);
    const [name, setName] = useState('Art Noir Studio');
    const [bio, setBio] = useState('Especialista en Blackwork y realismo oscuro. 10 años transformando piel en lienzos de contraste radical.');
    const [specialty1, setSpecialty1] = useState('Blackwork');
    const [specialty2, setSpecialty2] = useState('Dark Realism');
    const [specialty3, setSpecialty3] = useState('');
    const [mapLink, setMapLink] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [instagram, setInstagram] = useState('');
    const [facebook, setFacebook] = useState('');
`;

code = code.replace(targetState, newState);

code = code.replace('<h2 className="font-headline-lg text-headline-lg text-on-surface text-2xl">Bienvenido, @art_noir</h2>', '<h2 className="font-headline-lg text-headline-lg text-on-surface text-2xl">Bienvenido, {name}</h2>');

code = code.replace(/<input className="w-full bg-transparent border-b border-outline-variant\/30 py-2 text-sm focus:border-primary focus:ring-0 outline-none transition-colors" type="text" defaultValue="Art Noir Studio" \/>/g, '<input className="w-full bg-transparent border-b border-outline-variant/30 py-2 text-sm focus:border-primary focus:ring-0 outline-none transition-colors" type="text" value={name} onChange={(e) => setName(e.target.value)} />');

code = code.replace(/<textarea className="w-full bg-transparent border-b border-outline-variant\/30 py-2 text-sm focus:border-primary focus:ring-0 outline-none transition-colors resize-none" rows=\{3\} defaultValue="Especialista en Blackwork y realismo oscuro\. 10 años transformando piel en lienzos de contraste radical\."><\/textarea>/g, '<textarea className="w-full bg-transparent border-b border-outline-variant/30 py-2 text-sm focus:border-primary focus:ring-0 outline-none transition-colors resize-none" rows={3} value={bio} onChange={(e) => setBio(e.target.value)}></textarea>');

code = code.replace(/<input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="WhatsApp \(Ej: \+54 9 11\.\.\.\)" type="text" \/>/g, '<input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="WhatsApp (Ej: +54 9 11...)" type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />');

code = code.replace(/<input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="Instagram URL" type="text" \/>/g, '<input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="Instagram URL" type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} />');

code = code.replace(/<input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="Facebook URL" type="text" \/>/g, '<input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="Facebook URL" type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} />');

code = code.replace(/<input className="bg-surface-container-low border border-outline-variant\/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Especialidad 1" type="text" defaultValue="Blackwork"\/>/g, '<input className="bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Especialidad 1" type="text" value={specialty1} onChange={(e) => setSpecialty1(e.target.value)} />');

code = code.replace(/<input className="bg-surface-container-low border border-outline-variant\/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Especialidad 2" type="text" defaultValue="Dark Realism"\/>/g, '<input className="bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Especialidad 2" type="text" value={specialty2} onChange={(e) => setSpecialty2(e.target.value)} />');

code = code.replace(/<input className="bg-surface-container-low border border-outline-variant\/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Especialidad 3" type="text"\/>/g, '<input className="bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Especialidad 3" type="text" value={specialty3} onChange={(e) => setSpecialty3(e.target.value)} />');

code = code.replace(/<input className="w-full bg-surface-container-low border border-outline-variant\/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Enlace de ubicación" type="text"\/>/g, '<input className="w-full bg-surface-container-low border border-outline-variant/20 p-3 text-sm focus:border-primary focus:ring-0 outline-none" placeholder="Enlace de ubicación" type="text" value={mapLink} onChange={(e) => setMapLink(e.target.value)} />');

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
