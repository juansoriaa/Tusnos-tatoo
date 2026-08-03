const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// Add preload effect
const preloadEffect = `
  useEffect(() => {
    if (modalOpen && visibleTattoos.length > 0) {
      const nextIndex = activeTattooIndex < visibleTattoos.length - 1 ? activeTattooIndex + 1 : 0;
      const prevIndex = activeTattooIndex > 0 ? activeTattooIndex - 1 : visibleTattoos.length - 1;
      
      const preloadUrl = (url) => {
        if (url) {
          const img = new Image();
          img.src = url;
        }
      };
      
      // Preload next
      preloadUrl(visibleTattoos[nextIndex]?.previewUrl || visibleTattoos[nextIndex]?.src);
      // Preload prev
      preloadUrl(visibleTattoos[prevIndex]?.previewUrl || visibleTattoos[prevIndex]?.src);
    }
  }, [modalOpen, activeTattooIndex, visibleTattoos]);

  useEffect(() => {
    const handleScroll = () => {`;

content = content.replace(/  useEffect\(\(\) => \{\n    const handleScroll = \(\) => \{/, preloadEffect);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched ArtistProfile preload successfully!");
