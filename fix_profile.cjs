const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// Replace Share Button
const socialTarget = `          {/* Social & Stats */}
          <div className="flex justify-center mt-4 mb-4">
            <div className="flex items-center gap-2">
              <a className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white" href="#" aria-label="Instagram">`;

const socialReplacement = `          {/* Social & Stats */}
          <div className="flex justify-center mt-4 mb-4">
            <div className="flex items-center gap-2">
              <button 
                className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white" 
                aria-label="Compartir perfil"
                onClick={async () => {
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: artistData?.displayName || 'Perfil de Artista',
                        url: window.location.href
                      });
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      alert('URL copiada al portapapeles');
                    }
                  } catch (err) {
                    console.error('Error al compartir', err);
                  }
                }}
              >
                <span className="material-symbols-outlined">share</span>
              </button>
              <a className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white" href="#" aria-label="Instagram">`;

content = content.replace(socialTarget, socialReplacement);

// Replace Filters Section
const filterTarget = `        <section className="mt-12 px-gutter max-w-container-max mx-auto -mt-16 md:-mt-24">
          {/* Filter Tags */}
          <div className="flex items-center gap-4 mb-12 overflow-x-auto hide-scrollbar pb-4 border-b border-outline-variant/10">
            {filterCategories.map(cat => (
              <button 
                key={cat}
                onClick={() => { setActiveCategory(cat); setShowMore(false); }}
                className={\`whitespace-nowrap px-6 py-2 border font-label-md text-label-md uppercase font-bold transition-colors \${
                  activeCategory === cat 
                    ? 'border-primary bg-primary text-on-primary' 
                    : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }\`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}`;

const filterReplacement = `        <section className="mt-12 px-gutter max-w-container-max mx-auto -mt-16 md:-mt-24">
          {/* Filter Tags */}
          <div className="relative mb-12">
            <div className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-4 border-b border-outline-variant/10 pr-12 md:pr-0">
              {filterCategories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setShowMore(false); }}
                  className={\`whitespace-nowrap px-6 py-2 border font-label-md text-label-md uppercase font-bold transition-colors \${
                    activeCategory === cat 
                      ? 'border-primary bg-primary text-on-primary' 
                      : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                  }\`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Indicador de scroll táctil celular */}
            <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none flex justify-end items-center md:hidden">
              <span className="material-symbols-outlined text-on-surface-variant animate-pulse pr-1 text-xl opacity-60">swipe_left</span>
            </div>
          </div>

          {/* Masonry Grid */}`;

content = content.replace(filterTarget, filterReplacement);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

