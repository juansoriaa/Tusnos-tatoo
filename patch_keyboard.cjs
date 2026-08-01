const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// We need to add a useEffect for keyboard navigation
const keyboardHook = `
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!modalOpen) return;
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        const newIndex = activeTattooIndex < visibleTattoos.length - 1 ? activeTattooIndex + 1 : 0;
        const photoId = visibleTattoos[newIndex]?.id;
        if (photoId) {
          setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('obra', photoId); return p; }, { replace: true });
        }
      } else if (e.key === 'ArrowLeft') {
        const newIndex = activeTattooIndex > 0 ? activeTattooIndex - 1 : visibleTattoos.length - 1;
        const photoId = visibleTattoos[newIndex]?.id;
        if (photoId) {
          setSearchParams(prev => { const p = new URLSearchParams(prev); p.set('obra', photoId); return p; }, { replace: true });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, activeTattooIndex, visibleTattoos, setSearchParams]);
`;

// Insert it right after the existing modal useEffect
content = content.replace("document.body.classList.remove('overflow-hidden');\n    }\n  }, [searchParams, allTattoos, visibleTattoos, modalOpen, activeTattooIndex]);", "document.body.classList.remove('overflow-hidden');\n    }\n  }, [searchParams, allTattoos, visibleTattoos, modalOpen, activeTattooIndex]);\n" + keyboardHook);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched keyboard navigation successfully!");
