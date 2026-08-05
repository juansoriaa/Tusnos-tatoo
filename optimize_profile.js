import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const targetBanner = `        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-96 overflow-hidden">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: \`url('\${defaultBg}')\` }}></div>
          {/* Filtro oscuro para no perder la estética con fotos claras */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent"></div>
        </section>
        {/* Profile Header Section */}
        <section className="relative px-gutter -mt-12 md:-mt-20 flex flex-col items-center text-center z-10">
          {/* Profile Photo */}
          <div className="relative p-1 bg-background rounded-full mb-2">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary">
              <img className="w-full h-full object-cover" alt="Artist profile" src={defaultAvatar} />
            </div>
          </div>`;

const replacementBanner = `        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-96 overflow-hidden bg-surface-container">
          <OptimizedImage
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
             highResUrl={defaultBg}
             alt="Banner"
             useIntersectionObserver={false}
             loading="eager"
          />
          {/* Filtro oscuro para no perder la estética con fotos claras */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent"></div>
        </section>
        {/* Profile Header Section */}
        <section className="relative px-gutter -mt-12 md:-mt-20 flex flex-col items-center text-center z-10">
          {/* Profile Photo */}
          <div className="relative p-1 bg-background rounded-full mb-2">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-primary bg-surface-container">
              <OptimizedImage
                className="w-full h-full object-cover"
                alt="Artist profile"
                highResUrl={defaultAvatar}
                useIntersectionObserver={false}
                loading="eager"
              />
            </div>
          </div>`;

code = code.replace(targetBanner, replacementBanner);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
