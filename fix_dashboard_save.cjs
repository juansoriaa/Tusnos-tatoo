const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const target = `onChange={(e) => {
    const newIsAvailable = !e.target.checked;
    setIsAvailable(newIsAvailable);
    window.dispatchEvent(new CustomEvent('agendaStatusChanged', { detail: newIsAvailable }));
}}`;

const replacement = `onChange={(e) => {
    const newIsAvailable = !e.target.checked;
    setIsAvailable(newIsAvailable);
    
    // Save to localStorage immediately so DemoLayout state is preserved across route changes
    try {
        const saved = localStorage.getItem('demoArtistData');
        let data = saved ? JSON.parse(saved) : {};
        data.isAvailable = newIsAvailable;
        localStorage.setItem('demoArtistData', JSON.stringify(data));
    } catch(err) {}

    window.dispatchEvent(new CustomEvent('agendaStatusChanged', { detail: newIsAvailable }));
}}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
