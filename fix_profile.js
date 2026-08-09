import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// 1. Add visibleCount state
code = code.replace(
  /const \[isLoadingMore, setIsLoadingMore\] = useState\(false\);/,
  `const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory]);`
);

// 2. Modify visibleTattoos
code = code.replace(
  /const visibleTattoos = filteredTattoos;/,
  `const visibleTattoos = filteredTattoos.slice(0, visibleCount);`
);

// 3. Fix loadMoreTattoos logic
const loadMoreMatch = `  const loadMoreTattoos = async () => {
    if (!hasMore || !lastDoc || isLoadingMore) return;
    
    setIsLoadingMore(true);`;

const newLoadMore = `  const loadMoreTattoos = async () => {
    if (visibleCount < filteredTattoos.length) {
        setVisibleCount(prev => prev + 12);
        return;
    }
    if (!hasMore || !lastDoc || isLoadingMore) return;
    
    setIsLoadingMore(true);`;

code = code.replace(loadMoreMatch, newLoadMore);

// 4. Update the Cargar Más button area
const buttonArea = `          <div className="flex justify-center mt-12 gap-4">
            {hasMore && (
              <button type="button"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all uppercase tracking-widest border-b border-outline-variant hover:border-primary py-2 font-bold flex items-center gap-2" 
                onClick={loadMoreTattoos}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : null}
                {isLoadingMore ? 'Cargando...' : 'Cargar más'}
              </button>
            )}
          </div>`;

const newButtonArea = `          <div className="flex justify-center mt-12 gap-4">
            {(hasMore || visibleCount < filteredTattoos.length) && (
              <button type="button"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all uppercase tracking-widest border-b border-outline-variant hover:border-primary py-2 font-bold flex items-center gap-2" 
                onClick={loadMoreTattoos}
                disabled={isLoadingMore}
              >
                {isLoadingMore ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : null}
                {isLoadingMore ? 'Cargando...' : 'Cargar más'}
              </button>
            )}
            {visibleCount > 12 && (
              <button type="button"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all uppercase tracking-widest border-b border-outline-variant hover:border-primary py-2 font-bold flex items-center gap-2" 
                onClick={() => setVisibleCount(12)}
              >
                Ver menos
              </button>
            )}
          </div>`;

code = code.replace(buttonArea, newButtonArea);

// 5. Restore the logo size
code = code.replace(
  /<div className="top-0 left-0 z-40 px-3 py-1 bg-black\/30 backdrop-blur-sm fixed rounded-br-lg border-b border-r border-white\/5 profile-logo-container">/,
  '<div className="top-0 left-0 z-40 px-3 py-1.5 bg-black/60 backdrop-blur-md fixed profile-logo-container">'
);
code = code.replace(
  /<span className="font-label-md text-label-md font-extrabold text-white\/70 uppercase tracking-tighter profile-logo-text drop-shadow-md">Turnos <span className="text-primary\/80 profile-logo-primary">Tattoo<\/span><\/span>/,
  '<span className="font-label-md text-label-md font-extrabold text-white uppercase tracking-tighter profile-logo-text">Turnos <span className="text-primary profile-logo-primary">Tattoo</span></span>'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
