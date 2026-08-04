import fs from 'fs';

let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const isDemoTargetStr = `const isTargetDemo = () => {
        const targetId = resolveTargetId();
        return targetId === '@victor_ink' || targetId === 'victor_ink' || targetId === 'demo' || targetId === '@demo' || targetId === 'anonymous_demo';
    };`;

const oldArtistData = `  const [artistData, setArtistData] = useState<any>(() => {
    try {
        const targetId = resolveTargetId();
        let savedData = globalPreloadCache[targetId]?.artistData;
        if (!savedData) {
            const saved = localStorage.getItem('demoArtistData_' + targetId);
            if (saved) savedData = JSON.parse(saved);
        }
        if (savedData) {
            globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], artistData: savedData };
            return savedData;
        }
    } catch(e) {}
    return null;
  });`;

const newArtistData = `  ${isDemoTargetStr}
  const [artistData, setArtistData] = useState<any>(() => {
    try {
        const targetId = resolveTargetId();
        let savedData = globalPreloadCache[targetId]?.artistData;
        if (!savedData) {
            const saved = localStorage.getItem('demoArtistData_' + targetId);
            if (saved) savedData = JSON.parse(saved);
        }
        if (savedData) {
            globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], artistData: savedData };
            return savedData;
        }
    } catch(e) {}
    return isTargetDemo() ? DEMO_FALLBACK_ARTIST_DATA : null;
  });`;

const oldAllTattoos = `  const [allTattoos, setAllTattoos] = useState<any[]>(() => {
      try {
          const targetId = resolveTargetId();
          let savedData = globalPreloadCache[targetId]?.allTattoos;
          if (!savedData) {
              const saved = localStorage.getItem('demoAllTattoos_' + targetId);
              if (saved) savedData = JSON.parse(saved);
          }
          if (savedData) {
              globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], allTattoos: savedData };
              return savedData;
          }
      } catch(e) {}
      return [];
  });`;

const newAllTattoos = `  const [allTattoos, setAllTattoos] = useState<any[]>(() => {
      try {
          const targetId = resolveTargetId();
          let savedData = globalPreloadCache[targetId]?.allTattoos;
          if (!savedData) {
              const saved = localStorage.getItem('demoAllTattoos_' + targetId);
              if (saved) savedData = JSON.parse(saved);
          }
          if (savedData) {
              globalPreloadCache[targetId] = { ...globalPreloadCache[targetId], allTattoos: savedData };
              return savedData;
          }
      } catch(e) {}
      return isTargetDemo() ? DEMO_FALLBACK_PHOTOS : [];
  });`;


code = code.replace(oldArtistData, newArtistData);
code = code.replace(oldAllTattoos, newAllTattoos);

// Also remove the old fallback array from fetchTattoos to avoid duplication
const oldFallbackBlock = `                        if (isDemoUser) {
                            const fallback = [
                                {
                                  id: "fallback_1",
                                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ",
                                  alt: "A highly detailed black and grey realism tattoo of a lion's face on a human forearm.",
                                  title: "Detailed black & grey realism",
                                  categories: ["Realismo", "Blackwork"],
                                  hours: 12,
                                  sessions: 2,
                                  size: "20x15 cm"
                                },
                                {
                                  id: "fallback_2",
                                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5DDAAcFYiq49hBeVBI21d-Kfzr6qKoiRfIXKP1UnRW7YF5GJFA5MFkoXHtdBxy6uEbgH9z0zVWPWxKIEtX3oXemICFI1Ssr7FZ-Hh_OVDjHQ-QLRxMXBp5c4FwHXswrbPE9ZdzVelcUFL0h0nTLuzuWpLR_QRaZBZsyq7srBJaHktN6PcAYY-NQ2d-8FRg_RJ15MYhPUfdaEk_oGzE57hWrd7ZFkT4ldOW1tTIz0PqCqzo5_ALKPhXP1byoz8eiIEM30X9HQLzho",
                                  alt: "Close-up of a delicate minimalist tattoo of a single rose.",
                                  title: "Delicate minimalist single rose",
                                  categories: ["Minimalista"],
                                  hours: 3,
                                  sessions: 1,
                                  size: "8x5 cm"
                                },
                                {
                                  id: "fallback_3",
                                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE9qEOTq3DlR_Z_PI95eeZBU5YHIAzEqTN6zzltLD_41wX6e4LCHu8sREZZ4N_qV-XW271u6bCjyo14IHISQRVRhCSBJdX_ICJvg9EM-iYGcv1owFVPqatY3-0uESdozTCTcvTib8fe2Um_CI2L6mxqWeMg8IoYm0FYaTzlqISISzi52HOylwmgk_IxCrKp2vueZ90nk1bGHhgH3ybo0PI5u7VOpkB_kQTPzrRjD2-N3hC-9IB-OKvuic1rp7_8b4w562jI2tcCKA",
                                  alt: "Large-scale blackwork tattoo covering a full back.",
                                  title: "Large-scale blackwork back piece",
                                  categories: ["Blackwork", "Tradicional"],
                                  hours: 24,
                                  sessions: 4,
                                  size: "Espalda completa"
                                },
                                {
                                  id: "fallback_4",
                                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYd_bLleuw4yQOy32XLTc-ZA36ZI1Tx20UNajjWgcV5DQKPXzxE6vuXBvD3Ov7hcyCDB0Wpbc1BK7v4CJMIFC3KWS1bBdxzGJUcjSraTSohPMSOjESD5If5O8I8ZxmV0rWCZ_T_ncpPVYMBz9OD9_NXcCjwNkftJNjmowLcbK_jq3Fy-FieRJHky4A0G8SWmDSNGfDrlvoUxmb8aYt9Dxvi2w5uLOR4ir0BxgO2Sh5IfSstId4FI96uowW3Y1Jw1YCCRUk82ep4yPk",
                                  alt: "Hyper-realistic black and grey realism tattoo",
                                  title: "Hyper-realistic black & grey",
                                  categories: ["Realismo", "Blackwork"],
                                  hours: 15,
                                  sessions: 3,
                                  size: "Media manga"
                                },
                                {
                                  id: "fallback_5",
                                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCc5LMtrwwTSFu95uiU0bVfXq9VmWZIJ10dyJ3Lwbu6VmGCGEnBfZXi0WQlrXz0JAAAXzBurYTXa8IleL_Z1UTW7x4BHigWcVZCarsYy-PDu3G5JOwCsz3c0mgBTVI90e2b4bcw5lLDYzc5mU0qXptlWkjo0e3ynOS0xxfhCjxtvA0Bykbfo3wSX79T_fwcMg4uFHYXGxws2NYoOaKhhgr6J8ErFHQqB5QJSnK9c2zkwmEgiIM-74wbPKlVjQPO8pxETkDa8jrj1OmA",
                                  alt: "Detailed blackwork owl",
                                  title: "Detailed blackwork owl",
                                  categories: ["Blackwork", "Realismo"],
                                  hours: 8,
                                  sessions: 2,
                                  size: "15x15 cm"
                                }
                            ];
                            const limitedFallback = fallback.slice(0, 5);`;

const newFallbackBlock = `                        if (isDemoUser) {
                            const limitedFallback = DEMO_FALLBACK_PHOTOS.slice(0, 5);`;

code = code.replace(oldFallbackBlock, newFallbackBlock);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
