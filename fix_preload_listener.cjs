const fs = require('fs');
let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const targetEffect = `  useEffect(() => {
    const saved = localStorage.getItem('demoArtistData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.displayName) setArtistName(data.displayName);
        if (data.specialtyTags && data.specialtyTags.length > 0) setSpecialties(data.specialtyTags);
      } catch(e) {}
    }
  }, []);`;

const newEffect = `  useEffect(() => {
    const loadData = () => {
      const saved = localStorage.getItem('demoArtistData');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          if (data.displayName) setArtistName(data.displayName);
          if (data.specialtyTags && data.specialtyTags.length > 0) setSpecialties(data.specialtyTags);
        } catch(e) {}
      }
    };
    
    loadData();
    window.addEventListener('profileDataChanged', loadData);
    return () => window.removeEventListener('profileDataChanged', loadData);
  }, []);`;

content = content.replace(targetEffect, newEffect);
fs.writeFileSync('src/components/Preload.tsx', content);

