import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const filteredTattoos = allTattoos.filter(t => activeCategory === "All" || t.categories.includes(activeCategory));
  const visibleTattoos = showMore ? filteredTattoos : filteredTattoos.slice(0, 9);
  
  useEffect(() => {
    if (!showMore && filteredTattoos.length > 9) {
      // Preload the next images in background
      const hiddenTattoos = filteredTattoos.slice(9);
      const timer = setTimeout(() => {
        hiddenTattoos.forEach(tattoo => {
            if (tattoo.thumbnailUrl) {
                const img = new Image();
                img.src = tattoo.thumbnailUrl;
            } else if (tattoo.src) {
                const img = new Image();
                img.src = tattoo.src;
            }
        });
      }, 1000); // Wait 1 second after initial render to avoid stealing bandwidth
      return () => clearTimeout(timer);
    }
  }, [filteredTattoos, showMore]);`;

const rep = `  const filteredTattoos = allTattoos.filter(t => activeCategory === "All" || t.categories.includes(activeCategory));
  const visibleTattoos = filteredTattoos;`;

code = code.replace(target, rep);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
