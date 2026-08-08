import fs from 'fs';
let layoutCode = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

// Change max-w-lg to max-w-4xl and add max-h-[90vh] overflow-y-auto
layoutCode = layoutCode.replace(
  /className="bg-surface-container border border-outline-variant w-full max-w-lg p-6 relative flex flex-col gap-6 overflow-hidden rounded-2xl shadow-2xl"/g,
  'className="bg-surface-container border border-outline-variant w-full max-w-4xl p-6 relative flex flex-col gap-6 overflow-y-auto max-h-[90vh] rounded-2xl shadow-2xl"'
);

// Change grid to 2 columns on mobile, 4 on desktop
layoutCode = layoutCode.replace(
  /className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"/g,
  'className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"'
);

// Make texts smaller on mobile so 2 columns fit well
layoutCode = layoutCode.replace(
  /<h3 className="font-bold">/g,
  '<h3 className="font-bold text-sm md:text-base">'
);
layoutCode = layoutCode.replace(
  /<h3 className="font-bold text-on-surface">/g,
  '<h3 className="font-bold text-on-surface text-sm md:text-base">'
);
layoutCode = layoutCode.replace(
  /<p className="text-xs text-gray-400 mt-1">/g,
  '<p className="text-[10px] md:text-xs text-gray-400 mt-1 leading-tight">'
);
layoutCode = layoutCode.replace(
  /<div className="h-24 rounded-lg/g,
  '<div className="h-16 md:h-24 rounded-lg'
);
layoutCode = layoutCode.replace(
  /className="material-symbols-outlined text-primary text-3xl z-10"/g,
  'className="material-symbols-outlined text-primary text-2xl md:text-3xl z-10"'
);
layoutCode = layoutCode.replace(
  /className="material-symbols-outlined text-\[#FF2A85\] text-3xl z-10"/g,
  'className="material-symbols-outlined text-[#FF2A85] text-2xl md:text-3xl z-10"'
);
layoutCode = layoutCode.replace(
  /className="material-symbols-outlined text-\[#111111\] text-3xl z-10"/g,
  'className="material-symbols-outlined text-[#111111] text-2xl md:text-3xl z-10"'
);
layoutCode = layoutCode.replace(
  /className="material-symbols-outlined text-\[#00F0FF\] text-3xl z-10"/g,
  'className="material-symbols-outlined text-[#00F0FF] text-2xl md:text-3xl z-10"'
);


fs.writeFileSync('src/components/DemoLayout.tsx', layoutCode);
