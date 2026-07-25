const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const [activeCategory, setActiveCategory] = useState("All");
  const [allTattoos, setAllTattoos] = useState<any[]>([]);`;

const replacement = `  const [activeCategory, setActiveCategory] = useState("All");
  const [allTattoos, setAllTattoos] = useState<any[]>(() => {
      try {
          const saved = localStorage.getItem('demoAllTattoos_' + (id || 'demo'));
          if (saved) return JSON.parse(saved);
      } catch(e) {}
      return [];
  });`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

let preloadContent = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const preloadTarget = `        const snapshot = await getDocs(q);
        const allPhotos = snapshot.docs.map(doc => doc.data());
        
        allPhotos.sort((a, b) => {`;

const preloadReplacement = `        const snapshot = await getDocs(q);
        const allPhotos = snapshot.docs.map(doc => doc.data());
        localStorage.setItem('demoAllTattoos_' + (id || 'demo'), JSON.stringify(allPhotos));
        
        allPhotos.sort((a, b) => {`;

preloadContent = preloadContent.replace(preloadTarget, preloadReplacement);
fs.writeFileSync('src/components/Preload.tsx', preloadContent);

