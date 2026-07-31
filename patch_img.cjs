const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

// Add onError handler to image tags inside the gallery
content = content.replace(/<img alt=\{photo.alt\} className="w-full h-full object-cover" src=\{photo.src\} \/>/g, 
  '<img alt={photo.alt} className="w-full h-full object-cover" src={photo.src} onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" }} />');

content = content.replace(/<img alt=\{photo.alt\} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src=\{photo.src\} \/>/g, 
  '<img alt={photo.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={photo.src} onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCH5fThf0Btiu53jMH_le4vcfASgLiG-gdqI5g9_36ZwhiKkEBFxfEv2r8ARc_lSslfDGkXzUH1GdP8G821SmEjbBZLHY_UIL8KSlmrdDrukdFYnSsY1M86X_K-1wreu1K4wSoFGZc93Uu0XqRxJ52Bjrexvs09T-3ruXnaLYfkUICLtiGMhVKKzNAofdk4jVFbQdJgmZCIDjd1Yco-FJ0-CLEHTICTNOhz9aiqBk9_Z-hmxC1q9nakZDwQv_C2l5Syzft7xYyETyQ" }} />');

fs.writeFileSync('src/components/Landing.tsx', content);
