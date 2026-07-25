const fs = require('fs');

// UPDATE DASHBOARD TO DISPATCH
let dbContent = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');
const saveChangesTarget = `localStorage.setItem('demoArtistData', JSON.stringify(demoData));
                                    alert("Cambios guardados exitosamente!");`;
const saveChangesReplacement = `localStorage.setItem('demoArtistData', JSON.stringify(demoData));
                                    window.dispatchEvent(new CustomEvent('profileDataChanged'));
                                    alert("Cambios guardados exitosamente!");`;
dbContent = dbContent.replace(saveChangesTarget, saveChangesReplacement);
fs.writeFileSync('src/components/DemoDashboard.tsx', dbContent);

// UPDATE LAYOUT TO LISTEN
let layoutContent = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');
const eventListenerTarget = `window.addEventListener('agendaStatusChanged', handleStatus);
        
        const saved = localStorage.getItem('demoArtistData');`;
const eventListenerReplacement = `window.addEventListener('agendaStatusChanged', handleStatus);
        
        const loadAvatar = () => {
            const saved = localStorage.getItem('demoArtistData');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    if (data.profilePhotoUrl) {
                        setAvatarUrl(data.profilePhotoUrl);
                    }
                } catch(e) {}
            }
        };
        window.addEventListener('profileDataChanged', loadAvatar);
        
        const saved = localStorage.getItem('demoArtistData');`;
layoutContent = layoutContent.replace(eventListenerTarget, eventListenerReplacement);

const cleanupTarget = `return () => window.removeEventListener('agendaStatusChanged', handleStatus);`;
const cleanupReplacement = `return () => {
            window.removeEventListener('agendaStatusChanged', handleStatus);
            window.removeEventListener('profileDataChanged', loadAvatar);
        };`;
layoutContent = layoutContent.replace(cleanupTarget, cleanupReplacement);

fs.writeFileSync('src/components/DemoLayout.tsx', layoutContent);

