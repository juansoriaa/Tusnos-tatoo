const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `<div className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: \`url('\${artistData?.backgroundPhotos?.[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuBiWtwSf0Fh3AWm01LAlMfj3JGoOdHldaVkVIRDRpbavMRKQEt_SI7cvqZB7R56dQt7nuInHJM7V0a74racFxJT0E12v57KMBnC09rQOtg5YVpvOdglwy8KnhHl1H0tFedvuBum6LD2ADyKGFqdnQ3lUJqIhOZj6bJPzlLI4S7L2n9tqn9wZ6t8smG60s2wvnHM3NabsjD_rMrUmix943Tdd_CAZDTFaQeq5FEq8IXpsVkSLkJ24K0VpV9R4GRF2SDH8cwWPwwNjXI" }')\` }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>`;

const replacement = `<div className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: \`url('\${artistData?.backgroundPhotos?.[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuBiWtwSf0Fh3AWm01LAlMfj3JGoOdHldaVkVIRDRpbavMRKQEt_SI7cvqZB7R56dQt7nuInHJM7V0a74racFxJT0E12v57KMBnC09rQOtg5YVpvOdglwy8KnhHl1H0tFedvuBum6LD2ADyKGFqdnQ3lUJqIhOZj6bJPzlLI4S7L2n9tqn9wZ6t8smG60s2wvnHM3NabsjD_rMrUmix943Tdd_CAZDTFaQeq5FEq8IXpsVkSLkJ24K0VpV9R4GRF2SDH8cwWPwwNjXI" }')\` }}></div>
          {/* Filtro oscuro para no perder la estética con fotos claras */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-transparent"></div>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);

