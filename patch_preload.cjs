const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /const visibleTattoos = showMore \? filteredTattoos : filteredTattoos\.slice\(0, 9\);/,
    `const visibleTattoos = showMore ? filteredTattoos : filteredTattoos.slice(0, 9);
  
  useEffect(() => {
    if (!showMore && filteredTattoos.length > 9) {
      // Preload the next images in background
      const hiddenTattoos = filteredTattoos.slice(9);
      const timer = setTimeout(() => {
        hiddenTattoos.forEach(tattoo => {
            if (tattoo.thumbnailUrl) {
                const imgThumb = new Image();
                imgThumb.src = tattoo.thumbnailUrl;
            }
            if (tattoo.src) {
                const imgFull = new Image();
                imgFull.src = tattoo.src;
            }
        });
      }, 1000); // Wait 1 second after initial render to avoid stealing bandwidth
      return () => clearTimeout(timer);
    }
  }, [filteredTattoos, showMore]);`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
