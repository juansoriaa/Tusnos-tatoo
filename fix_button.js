import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `          <div className="flex justify-center mt-12 gap-4">
            {filteredTattoos.length > 9 && (
              <button type="button"
                className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-all uppercase tracking-widest border-b border-outline-variant hover:border-primary py-2 font-bold" 
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>`;

const rep = `          <div className="flex justify-center mt-12 gap-4">
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

code = code.replace(target, rep);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
