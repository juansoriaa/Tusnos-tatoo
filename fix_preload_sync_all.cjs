const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const stateTarget = `  const [artistName, setArtistName] = useState('Victor Ink');
  const [specialties, setSpecialties] = useState<string[]>(['Realismo', 'Black & Grey']);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0');`;

const stateReplacement = `  const [artistName, setArtistName] = useState(() => {
    try {
      const saved = localStorage.getItem('demoArtistData');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.displayName) return data.displayName;
      }
    } catch(e) {}
    return 'Victor Ink';
  });
  const [specialties, setSpecialties] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('demoArtistData');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.specialtyTags && data.specialtyTags.length > 0) return data.specialtyTags;
      }
    } catch(e) {}
    return ['Realismo', 'Black & Grey'];
  });
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(() => {
    try {
      const saved = localStorage.getItem('demoArtistData');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.profilePhotoUrl) return data.profilePhotoUrl;
      }
    } catch(e) {}
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0';
  });`;

content = content.replace(stateTarget, stateReplacement);
fs.writeFileSync('src/components/Preload.tsx', content);

