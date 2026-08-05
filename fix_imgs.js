import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target1 = `<img className="w-full h-full object-cover" alt="Artist profile" src={defaultAvatar} />`;
const rep1 = `<OptimizedImage className="w-full h-full object-cover" alt="Artist profile" highResUrl={defaultAvatar} useIntersectionObserver={false} loading="eager" />`;

const target2 = `<img className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-500" alt="Map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1MG2dFZwUDUPDIxG_Aln6x7qj7PTFU-nq71Kz_QrgZTsCKbHPWFjx1ECNLxh36R0plsldSaxtyWi1PPUfx4GZVICAiwQXgKFS91w9QB5JPN2AUgGXuwSqPAQHVv_Rrra-Rqlu99MtTqyjx4iIJbH0Xe-XAk9kQyS0DhXbqymKwhMbLjhlxQ9vs6vSgvupRUsYJkHkoWe_Sp9AOCXN0tXfooiYuXTp3PQK0-nvaoIExJsH7e4H5n1iynsgSXS0Bc702RScJbs0uf8" />`;
const rep2 = `<OptimizedImage className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-60 transition-opacity duration-500" alt="Map" highResUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuC1MG2dFZwUDUPDIxG_Aln6x7qj7PTFU-nq71Kz_QrgZTsCKbHPWFjx1ECNLxh36R0plsldSaxtyWi1PPUfx4GZVICAiwQXgKFS91w9QB5JPN2AUgGXuwSqPAQHVv_Rrra-Rqlu99MtTqyjx4iIJbH0Xe-XAk9kQyS0DhXbqymKwhMbLjhlxQ9vs6vSgvupRUsYJkHkoWe_Sp9AOCXN0tXfooiYuXTp3PQK0-nvaoIExJsH7e4H5n1iynsgSXS0Bc702RScJbs0uf8" useIntersectionObserver={true} />`;

const target3 = `<img className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-primary shrink-0" alt={artistData?.displayName || "Artist"} src={defaultAvatar} />`;
const rep3 = `<OptimizedImage className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-2 border-primary shrink-0" alt={artistData?.displayName || "Artist"} highResUrl={defaultAvatar} useIntersectionObserver={true} />`;

const target4 = `<img src={waitlistForm.referenceImage || undefined} alt="Referencia" className="w-20 h-20 object-cover rounded border border-border-muted shrink-0" />`;
const rep4 = `<OptimizedImage highResUrl={waitlistForm.referenceImage || ""} alt="Referencia" className="w-20 h-20 object-cover rounded border border-border-muted shrink-0" useIntersectionObserver={true} />`;


const targetBanner = `        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-96 overflow-hidden">
          <div className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: \`url('\${defaultBg}')\` }}></div>`;

const repBanner = `        {/* Banner Section */}
        <section className="relative w-full h-64 md:h-96 overflow-hidden bg-surface-container">
          <OptimizedImage
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
             highResUrl={defaultBg}
             alt="Banner"
             useIntersectionObserver={false}
             loading="eager"
          />`;

code = code.replace(target1, rep1).replace(target2, rep2).replace(target3, rep3).replace(target4, rep4).replace(targetBanner, repBanner);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
