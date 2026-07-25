const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const targetArtistData = `  const [artistData, setArtistData] = useState<any>(null);`;
const replacementArtistData = `  const [artistData, setArtistData] = useState<any>(() => {
    if (!id) {
        try {
            const saved = localStorage.getItem('demoArtistData');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch(e) {}
    }
    return null;
  });`;

content = content.replace(targetArtistData, replacementArtistData);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
