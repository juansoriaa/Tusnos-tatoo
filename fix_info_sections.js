import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf8');

// 1. Update Minimal Clean info-section
css = css.replace(
  /\.theme-minimal-clean \.info-section \{\n\s*background: #FFFFFF !important;\n\s*border: 1px solid #EFEFF4 !important;\n\s*border-radius: 8px !important;/g,
  ".theme-minimal-clean .info-section {\n    background: #FFFFFF !important;\n    border: 1px solid #EFEFF4 !important;\n    border-left: 3px solid #111111 !important;\n    border-radius: 0 8px 8px 0 !important;"
);

// 2. Add global info-section at the start of @layer components
css = css.replace(
  /@layer components \{/,
  "@layer components {\n  .info-section {\n    border-left: 3px solid var(--color-primary) !important;\n    border-radius: 0 8px 8px 0 !important;\n  }"
);

fs.writeFileSync('src/index.css', css);
