const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

content = content.replace(/className="toggle-checkbox absolute block w-8 h-8 rounded-none bg-surface border-2 border-outline-variant appearance-none cursor-pointer z-10"/, 
'className="toggle-checkbox peer absolute block w-8 h-8 rounded-none bg-surface border-2 border-outline-variant appearance-none cursor-pointer z-10 checked:translate-x-8 checked:border-emerald-accent transition-transform duration-300 ease-in-out"');

content = content.replace(/onChange=\{\(e\) => setIsAvailable\(!e.target.checked\)\}/, 
`onChange={(e) => {
    const newIsAvailable = !e.target.checked;
    setIsAvailable(newIsAvailable);
    window.dispatchEvent(new CustomEvent('agendaStatusChanged', { detail: newIsAvailable }));
}}
style={{borderColor: !isAvailable ? '#054d44' : ''}}`);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
