const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const [artistData, setArtistData] = useState<any>(() => {
    if (!id) {
        try {
            const saved = localStorage.getItem('demoArtistData_' + (id || 'demo'));
            if (saved) {
                return JSON.parse(saved);
            }
        } catch(e) {}
    }
    return null;
  });`;

const replacement = `  const [artistData, setArtistData] = useState<any>(() => {
    try {
        const saved = localStorage.getItem('demoArtistData_' + (id || 'demo'));
        if (saved) {
            return JSON.parse(saved);
        }
    } catch(e) {}
    return null;
  });`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);

