import fs from 'fs';

// 1. Remove the global .info-section from index.css
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(
  /@layer components \{\n\s*\.info-section \{\n\s*border-left: 3px solid var\(--color-primary\) !important;\n\s*border-radius: 0 8px 8px 0 !important;\n\s*\}/,
  "@layer components {"
);
fs.writeFileSync('src/index.css', css);

// 2. Add tailwind classes to the elements in ArtistProfile.tsx
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// For "El Estudio"
code = code.replace(
  /className="text-left info-section bg-surface-container p-8 border border-outline-variant\/20"/g,
  'className="text-left info-section bg-surface-container p-8 border border-outline-variant/20 border-l-[3px] border-l-primary rounded-l-none rounded-r-lg"'
);

// For "Sobre Mí"
code = code.replace(
  /className="bg-surface-container p-8 border border-outline-variant\/20 flex flex-col gap-8 items-center text-center info-section"/g,
  'className="bg-surface-container p-8 border border-outline-variant/20 border-l-[3px] border-l-primary rounded-l-none rounded-r-lg flex flex-col gap-8 items-center text-center info-section"'
);

// Also FAQs? The user said "la sección estudio y sobre mi", maybe FAQ too?
// Wait, for themes, FAQ is styled via `.info-section details`. Does FAQ have `info-section`?
// Let's check if FAQ has info-section.

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
