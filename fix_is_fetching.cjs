const fs = require('fs');
let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const target = `  const [profilePhotoUrl, setProfilePhotoUrl] = useState(() => {
    try {
      const saved = localStorage.getItem('demoArtistData');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.profilePhotoUrl) return data.profilePhotoUrl;
      }
    } catch(e) {}
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0';
  });
  const [bgPhotos, setBgPhotos] = useState<string[]>(() => {`;

const replacement = `  const [profilePhotoUrl, setProfilePhotoUrl] = useState(() => {
    try {
      const saved = localStorage.getItem('demoArtistData');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.profilePhotoUrl) return data.profilePhotoUrl;
      }
    } catch(e) {}
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0';
  });
  const [isFetchingBg, setIsFetchingBg] = useState(true);
  const [bgPhotos, setBgPhotos] = useState<string[]>(() => {`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/Preload.tsx', content);

