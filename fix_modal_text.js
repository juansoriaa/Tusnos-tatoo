import fs from 'fs';
let layoutCode = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

layoutCode = layoutCode.replace(
  /className="font-bold text-sm md:text-base"/g,
  'className="font-bold"'
);
layoutCode = layoutCode.replace(
  /className="font-bold text-on-surface text-sm md:text-base"/g,
  'className="font-bold text-on-surface"'
);
layoutCode = layoutCode.replace(
  /className="text-\[10px\] md:text-xs text-gray-400 mt-1 leading-tight"/g,
  'className="text-xs text-gray-400 mt-1"'
);

fs.writeFileSync('src/components/DemoLayout.tsx', layoutCode);
