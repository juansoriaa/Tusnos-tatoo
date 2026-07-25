const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

// Add isLoadingBg state
const stateTarget = `  const [profilePhotoUrl, setProfilePhotoUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0');
  const [bgPhotos, setBgPhotos] = useState<string[]>([]);`;

const stateReplacement = `  const [profilePhotoUrl, setProfilePhotoUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0');
  const [bgPhotos, setBgPhotos] = useState<string[]>([]);
  const [isFetchingBg, setIsFetchingBg] = useState(true);`;

content = content.replace(stateTarget, stateReplacement);

// Update loadData
const loadDataTarget = `          if (data.profilePhotoUrl) setProfilePhotoUrl(data.profilePhotoUrl);
        } catch(e) {}
      }
    };`;

const loadDataReplacement = `          if (data.profilePhotoUrl) setProfilePhotoUrl(data.profilePhotoUrl);
        } catch(e) {}
      }
      const savedBg = localStorage.getItem('demoBgPhotos');
      if (savedBg) {
        try {
          const parsed = JSON.parse(savedBg);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBgPhotos(parsed);
          }
        } catch(e) {}
      }
    };`;

content = content.replace(loadDataTarget, loadDataReplacement);

// Update fetch
const fetchTarget = `        // Grab top 3 pinned/recent for background
        let top3 = allPhotos.slice(0, 3).map(data => data.url || data.thumbnailUrl).filter(url => url);
        if (top3.length > 0) {
            // Need exactly 4 items for the CSS 25% width logic to work correctly
            let bg4 = [...top3];
            while(bg4.length < 4) {
                bg4.push(bg4[bg4.length % top3.length]);
            }
            setBgPhotos(bg4);
        }`;

const fetchReplacement = `        // Grab top 3 pinned/recent for background
        let top3 = allPhotos.slice(0, 3).map(data => data.thumbnailUrl || data.url).filter(url => url);
        if (top3.length > 0) {
            // Need exactly 4 items for the CSS 25% width logic to work correctly
            let bg4 = [...top3];
            while(bg4.length < 4) {
                bg4.push(bg4[bg4.length % top3.length]);
            }
            setBgPhotos(bg4);
            localStorage.setItem('demoBgPhotos', JSON.stringify(bg4));
        }
        setIsFetchingBg(false);`;

content = content.replace(fetchTarget, fetchReplacement);

// Update render
const renderTarget = `        <div className="animate-scroll-bg h-full">
          {bgPhotos.length > 0 ? (
            <>
              {bgPhotos.map((url, i) => (
                <img key={i} alt={\`Background Tattoo \${i+1}\`} className="carousel-img" src={url} />
              ))}
              {/* Duplicate for infinite loop */}
              {bgPhotos.map((url, i) => (
                <img key={\`dup-\${i}\`} alt={\`Background Tattoo \${i+1}\`} className="carousel-img" src={url} />
              ))}
            </>
          ) : (`;

const renderReplacement = `        <div className="animate-scroll-bg h-full">
          {bgPhotos.length > 0 ? (
            <>
              {bgPhotos.map((url, i) => (
                <img key={i} alt={\`Background Tattoo \${i+1}\`} className="carousel-img" src={url} />
              ))}
              {/* Duplicate for infinite loop */}
              {bgPhotos.map((url, i) => (
                <img key={\`dup-\${i}\`} alt={\`Background Tattoo \${i+1}\`} className="carousel-img" src={url} />
              ))}
            </>
          ) : isFetchingBg ? null : (`;

content = content.replace(renderTarget, renderReplacement);

fs.writeFileSync('src/components/Preload.tsx', content);
