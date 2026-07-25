const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const stateTarget = `  const [profilePhotoUrl, setProfilePhotoUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0');
  const [bgPhotos, setBgPhotos] = useState<string[]>([]);
  const [isFetchingBg, setIsFetchingBg] = useState(true);`;

const stateReplacement = `  const [profilePhotoUrl, setProfilePhotoUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0');
  const [bgPhotos, setBgPhotos] = useState<string[]>(() => {
    try {
      const savedBg = localStorage.getItem('demoBgPhotos');
      if (savedBg) {
        const parsed = JSON.parse(savedBg);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch(e) {}
    return [];
  });`;

content = content.replace(stateTarget, stateReplacement);

const loadDataTarget = `      const savedBg = localStorage.getItem('demoBgPhotos');
      if (savedBg) {
        try {
          const parsed = JSON.parse(savedBg);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBgPhotos(parsed);
          }
        } catch(e) {}
      }`;

content = content.replace(loadDataTarget, ``);

const fetchTarget = `            setBgPhotos(bg4);
            localStorage.setItem('demoBgPhotos', JSON.stringify(bg4));
        }
        setIsFetchingBg(false);`;

const fetchReplacement = `            // Only update state if URLs are different to avoid re-rendering jump
            setBgPhotos(prev => {
              if (JSON.stringify(prev) !== JSON.stringify(bg4)) {
                return bg4;
              }
              return prev;
            });
            localStorage.setItem('demoBgPhotos', JSON.stringify(bg4));
        }`;

content = content.replace(fetchTarget, fetchReplacement);

const renderTarget = `            </>
          ) : isFetchingBg ? null : (
            <>`;

const renderReplacement = `            </>
          ) : (
            <>`;

content = content.replace(renderTarget, renderReplacement);

fs.writeFileSync('src/components/Preload.tsx', content);
