import fs from 'fs';

let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

// Replace cyber neon modal box colors
code = code.replace(
  /theme === 'cyber_neon' \? 'border-\[#00F0FF\] bg-\[#00F0FF\]\/10' : 'border-outline-variant hover:border-gray-500 bg-surface'/g,
  "theme === 'cyber_neon' ? 'border-[#FF1E38] bg-[#FF1E38]/10' : 'border-outline-variant hover:border-gray-500 bg-surface'"
);

code = code.replace(
  /<div className="absolute inset-0 bg-gradient-to-br from-\[#00F0FF\]\/20 to-transparent"><\/div>/g,
  '<div className="absolute inset-0 bg-gradient-to-br from-[#FF1E38]/20 to-transparent"></div>'
);

code = code.replace(
  /<span className="material-symbols-outlined text-\[#00F0FF\] text-2xl md:text-3xl z-10" style=\{\{textShadow: '0 0 10px rgba\(0,240,255,0\.8\)'\}\}>memory<\/span>/g,
  '<span className="material-symbols-outlined text-[#FF1E38] text-2xl md:text-3xl z-10" style={{textShadow: \'0 0 10px rgba(255,30,56,0.8)\'}}>memory</span>'
);

code = code.replace(
  /<h3 className="font-bold text-on-surface">Cyber Neon<\/h3>/g,
  '<h3 className="font-bold text-on-surface">Dark Crimson</h3>'
);

code = code.replace(
  /<p className="text-xs text-gray-400 mt-1">Negro profundo y cian eléctrico\. Estética futurista\.<\/p>/g,
  '<p className="text-xs text-gray-400 mt-1">Negro profundo y rojo sangre. Estética underground.</p>'
);

code = code.replace(
  /\{theme === 'cyber_neon' && <div className="absolute top-2 right-2 text-\[#00F0FF\]"><span className="material-symbols-outlined text-sm">check_circle<\/span><\/div>\}/g,
  "{theme === 'cyber_neon' && <div className=\"absolute top-2 right-2 text-[#FF1E38]\"><span className=\"material-symbols-outlined text-sm\">check_circle</span></div>}"
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
