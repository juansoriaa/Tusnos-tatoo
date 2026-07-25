const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

// Replace states
const stateTarget = `  const [artistName, setArtistName] = useState('Victor Ink');
  const [specialties, setSpecialties] = useState<string[]>(['Realismo', 'Black & Grey']);`;
  
const stateReplacement = `  const [artistName, setArtistName] = useState('Victor Ink');
  const [specialties, setSpecialties] = useState<string[]>(['Realismo', 'Black & Grey']);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0');
  const [bgPhotos, setBgPhotos] = useState<string[]>([]);`;

content = content.replace(stateTarget, stateReplacement);

// Replace loadData
const loadDataTarget = `          if (data.displayName) setArtistName(data.displayName);
          if (data.specialtyTags && data.specialtyTags.length > 0) setSpecialties(data.specialtyTags);`;
const loadDataReplacement = `          if (data.displayName) setArtistName(data.displayName);
          if (data.specialtyTags && data.specialtyTags.length > 0) setSpecialties(data.specialtyTags);
          if (data.profilePhotoUrl) setProfilePhotoUrl(data.profilePhotoUrl);`;

content = content.replace(loadDataTarget, loadDataReplacement);

// Update preloadImages
const preloadImagesTarget = `        const snapshot = await getDocs(q);
        const urlsToPreload = snapshot.docs.map(doc => {
            const data = doc.data();
            return data.thumbnailUrl || data.url;
        }).filter(url => url);

        // Also preload the fallback tattoos if there are any, though they're probably fast enough
        // Wait for images to load in browser cache
        await Promise.all(urlsToPreload.map(url => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve; // resolve anyway so we don't block
          });
        }));`;

const preloadImagesReplacement = `        const snapshot = await getDocs(q);
        const allPhotos = snapshot.docs.map(doc => doc.data());
        
        allPhotos.sort((a, b) => {
           const aPinned = a.pinned === true;
           const bPinned = b.pinned === true;
           if (aPinned && bPinned) return (a.pinnedOrder || 0) - (b.pinnedOrder || 0);
           if (aPinned) return -1;
           if (bPinned) return 1;
           return 0;
        });

        const urlsToPreload = allPhotos.map(data => data.thumbnailUrl || data.url).filter(url => url);
        
        // Grab top 3 pinned/recent for background
        let top3 = allPhotos.slice(0, 3).map(data => data.url || data.thumbnailUrl).filter(url => url);
        if (top3.length > 0) {
            setBgPhotos(top3);
        }

        // Wait for images to load in browser cache
        await Promise.all(urlsToPreload.map(url => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve; // resolve anyway so we don't block
          });
        }));`;

content = content.replace(preloadImagesTarget, preloadImagesReplacement);

// Replace default bg photos logic
const bgTarget = `        <div className="animate-scroll-bg h-full">
          <img alt="Tattoo 1" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" />
          <img alt="Tattoo 2" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHwNb_MhbHOaP6c0Rl1EqFCiTHvx3OrwkHec41w-pIzdVOr7fsJR6seTV1H8FzBJ3iiQ-niPppsHlussWManmq3_37uMTyIRgGyAfz38023h98-mc7TXCSIobUFesaE9i91952TUovITXSuF_0DHR_r_6GS38wv-AYSWni62vZFkiIacuuAHSHqUBld76UFh-NsXjsIcZg-h_Vn10CGZcp3HYUtlUEeh82negXGsgP2u_nBmavAlj48S7v5uf-_qARYs4xf7o9gE8" />
          <img alt="Tattoo 3" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBExqvT9llX2D0HY5gXD0pgutK1YUyCLP8CEJNM8DIVtN8ENfn13RmMA5bovsMB-J8PbQROw4rmvLORq0cF06c0VBS-zmh5vwUl_NjO2286Jnxr4srgoffNsb3K-JLYcCnNu81k1Cr-NYP_zhnNCtodbCXfKdcnq642dwIfs68cY47x8J7t7YsfjcAGo0eHcF5dfZEsWIDrYHtHIcbUkCn02Aho6E_OGQH6HdhW0i8n5qmt9rh0jY2uJWH3_qIzu7GXxNkfS-jybkg" />
          <img alt="Tattoo 4" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASHOMWeKVAQxGeWzc3sI2E5n8qAgw4P6xBLVnmV7EZhijxL5vffctyZq054C_Kcef9vYXNrqjJGHNeLW-lkEWK9KyQkyhnDLgXzLHPBh6ptgR6rrfFHCLKGzn4OJ7orZ8TZRua_YRLRwa5zhHRlFw8fZZurBfewtZA7Y2irrPpphi6K9XRUng_BiIaoMKAeAhG1-E8Re72e3sJpdd-7sZHmafVRKt2n5usQT048dwPRTpveoXDEmTg8JVskpX5GowUCm2MaHCDMnw" />
          {/* Duplicate for infinite loop */}
          <img alt="Tattoo 1" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" />
          <img alt="Tattoo 2" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHwNb_MhbHOaP6c0Rl1EqFCiTHvx3OrwkHec41w-pIzdVOr7fsJR6seTV1H8FzBJ3iiQ-niPppsHlussWManmq3_37uMTyIRgGyAfz38023h98-mc7TXCSIobUFesaE9i91952TUovITXSuF_0DHR_r_6GS38wv-AYSWni62vZFkiIacuuAHSHqUBld76UFh-NsXjsIcZg-h_Vn10CGZcp3HYUtlUEeh82negXGsgP2u_nBmavAlj48S7v5uf-_qARYs4xf7o9gE8" />
          <img alt="Tattoo 3" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBExqvT9llX2D0HY5gXD0pgutK1YUyCLP8CEJNM8DIVtN8ENfn13RmMA5bovsMB-J8PbQROw4rmvLORq0cF06c0VBS-zmh5vwUl_NjO2286Jnxr4srgoffNsb3K-JLYcCnNu81k1Cr-NYP_zhnNCtodbCXfKdcnq642dwIfs68cY47x8J7t7YsfjcAGo0eHcF5dfZEsWIDrYHtHIcbUkCn02Aho6E_OGQH6HdhW0i8n5qmt9rh0jY2uJWH3_qIzu7GXxNkfS-jybkg" />
          <img alt="Tattoo 4" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASHOMWeKVAQxGeWzc3sI2E5n8qAgw4P6xBLVnmV7EZhijxL5vffctyZq054C_Kcef9vYXNrqjJGHNeLW-lkEWK9KyQkyhnDLgXzLHPBh6ptgR6rrfFHCLKGzn4OJ7orZ8TZRua_YRLRwa5zhHRlFw8fZZurBfewtZA7Y2irrPpphi6K9XRUng_BiIaoMKAeAhG1-E8Re72e3sJpdd-7sZHmafVRKt2n5usQT048dwPRTpveoXDEmTg8JVskpX5GowUCm2MaHCDMnw" />
        </div>`;

const bgReplacement = `        <div className="animate-scroll-bg h-full">
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
          ) : (
            <>
              <img alt="Tattoo 1" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" />
              <img alt="Tattoo 2" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHwNb_MhbHOaP6c0Rl1EqFCiTHvx3OrwkHec41w-pIzdVOr7fsJR6seTV1H8FzBJ3iiQ-niPppsHlussWManmq3_37uMTyIRgGyAfz38023h98-mc7TXCSIobUFesaE9i91952TUovITXSuF_0DHR_r_6GS38wv-AYSWni62vZFkiIacuuAHSHqUBld76UFh-NsXjsIcZg-h_Vn10CGZcp3HYUtlUEeh82negXGsgP2u_nBmavAlj48S7v5uf-_qARYs4xf7o9gE8" />
              <img alt="Tattoo 3" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBExqvT9llX2D0HY5gXD0pgutK1YUyCLP8CEJNM8DIVtN8ENfn13RmMA5bovsMB-J8PbQROw4rmvLORq0cF06c0VBS-zmh5vwUl_NjO2286Jnxr4srgoffNsb3K-JLYcCnNu81k1Cr-NYP_zhnNCtodbCXfKdcnq642dwIfs68cY47x8J7t7YsfjcAGo0eHcF5dfZEsWIDrYHtHIcbUkCn02Aho6E_OGQH6HdhW0i8n5qmt9rh0jY2uJWH3_qIzu7GXxNkfS-jybkg" />
              <img alt="Tattoo 4" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASHOMWeKVAQxGeWzc3sI2E5n8qAgw4P6xBLVnmV7EZhijxL5vffctyZq054C_Kcef9vYXNrqjJGHNeLW-lkEWK9KyQkyhnDLgXzLHPBh6ptgR6rrfFHCLKGzn4OJ7orZ8TZRua_YRLRwa5zhHRlFw8fZZurBfewtZA7Y2irrPpphi6K9XRUng_BiIaoMKAeAhG1-E8Re72e3sJpdd-7sZHmafVRKt2n5usQT048dwPRTpveoXDEmTg8JVskpX5GowUCm2MaHCDMnw" />
              {/* Duplicate for infinite loop */}
              <img alt="Tattoo 1" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" />
              <img alt="Tattoo 2" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHwNb_MhbHOaP6c0Rl1EqFCiTHvx3OrwkHec41w-pIzdVOr7fsJR6seTV1H8FzBJ3iiQ-niPppsHlussWManmq3_37uMTyIRgGyAfz38023h98-mc7TXCSIobUFesaE9i91952TUovITXSuF_0DHR_r_6GS38wv-AYSWni62vZFkiIacuuAHSHqUBld76UFh-NsXjsIcZg-h_Vn10CGZcp3HYUtlUEeh82negXGsgP2u_nBmavAlj48S7v5uf-_qARYs4xf7o9gE8" />
              <img alt="Tattoo 3" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBExqvT9llX2D0HY5gXD0pgutK1YUyCLP8CEJNM8DIVtN8ENfn13RmMA5bovsMB-J8PbQROw4rmvLORq0cF06c0VBS-zmh5vwUl_NjO2286Jnxr4srgoffNsb3K-JLYcCnNu81k1Cr-NYP_zhnNCtodbCXfKdcnq642dwIfs68cY47x8J7t7YsfjcAGo0eHcF5dfZEsWIDrYHtHIcbUkCn02Aho6E_OGQH6HdhW0i8n5qmt9rh0jY2uJWH3_qIzu7GXxNkfS-jybkg" />
              <img alt="Tattoo 4" className="carousel-img" src="https://lh3.googleusercontent.com/aida-public/AB6AXuASHOMWeKVAQxGeWzc3sI2E5n8qAgw4P6xBLVnmV7EZhijxL5vffctyZq054C_Kcef9vYXNrqjJGHNeLW-lkEWK9KyQkyhnDLgXzLHPBh6ptgR6rrfFHCLKGzn4OJ7orZ8TZRua_YRLRwa5zhHRlFw8fZZurBfewtZA7Y2irrPpphi6K9XRUng_BiIaoMKAeAhG1-E8Re72e3sJpdd-7sZHmafVRKt2n5usQT048dwPRTpveoXDEmTg8JVskpX5GowUCm2MaHCDMnw" />
            </>
          )}
        </div>`;
content = content.replace(bgTarget, bgReplacement);

// Replace profile image
const profileImgTarget = `<img alt="Victor Ink Profile" className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_KPGqcJA_LhFIZepjSW5Tf7MtTYEc4iRE4J7SbB3ZSPxSwnEhyd39Iptl8UJFQS6m269Hwwx2KZd5ywVY5a6mTaGP0eKxhhFlOChAey3A8OvJ2X43uTD6BH3bkh9AjFk_ged61veFwFc7XeGxUyraAjawtpIIQxmkRhrpbijpEFfFKyxzuCj7Ltek0mSl4QQtognkqRBrsSC25geKA2JCuif3FBQ8nEvcajl0_fkXLSakiANOEXbVDwi9vnMRrjEXDcc5_qMFBm0" />`;
const profileImgReplacement = `<img alt={artistName} className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700" src={profilePhotoUrl} />`;
content = content.replace(profileImgTarget, profileImgReplacement);

fs.writeFileSync('src/components/Preload.tsx', content);
