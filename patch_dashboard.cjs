const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf-8');

// Add state variables
content = content.replace(
    /const \[whatsapp, setWhatsapp\] = useState\(''\);/,
    `const [whatsapp, setWhatsapp] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [customPassword, setCustomPassword] = useState('');`
);

// Load data to state variables
content = content.replace(
    /setWhatsapp\(data.whatsapp \|\| ''\);/,
    `setWhatsapp(data.whatsapp || '');
                setLoginEmail(data.email || '');
                setCustomPassword(data.customPassword || '');`
);

// Set initial data
content = content.replace(
    /whatsapp: data.whatsapp \|\| '',/,
    `whatsapp: data.whatsapp || '',
                    loginEmail: data.email || '',
                    customPassword: data.customPassword || '',`
);

// Add to currentData
content = content.replace(
    /whatsapp, instagram,/,
    `whatsapp, instagram, loginEmail, customPassword,`
);

// Add to demoData
content = content.replace(
    /whatsapp: whatsapp,/,
    `whatsapp: whatsapp,
            email: loginEmail,
            customPassword: customPassword,`
);

// Render Email and Password inputs
content = content.replace(
    /<div className="space-y-4 pt-4">/,
    `<div className="space-y-4 pt-4">
                                    <div className="flex items-center gap-3 bg-surface-container-low p-3 border border-outline-variant/10 relative">
                                        <span className="material-symbols-outlined text-primary shrink-0" style={{color: '#054d44'}}>mail</span>
                                        <input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="correo@ejemplo.com" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                                    </div>
                                    <div className="flex items-center gap-3 bg-surface-container-low p-3 border border-outline-variant/10 relative">
                                        <span className="material-symbols-outlined text-primary shrink-0" style={{color: '#054d44'}}>lock</span>
                                        <input className="w-full bg-transparent border-none p-0 focus:ring-0 text-xs outline-none" placeholder="Nueva Contraseña (opcional)" type="text" value={customPassword} onChange={(e) => setCustomPassword(e.target.value)} />
                                    </div>`
);


fs.writeFileSync('src/components/DemoDashboard.tsx', content);
console.log("Patched DemoDashboard successfully!");
