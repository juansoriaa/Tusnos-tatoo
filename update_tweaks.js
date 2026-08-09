import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf8');

// Change text color from black to white on active badges/buttons
css = css.replace(
  /\.theme-cyber-neon \.specialty-badge\.active,\n\s*\.theme-cyber-neon \.category-filter-btn\.active \{\n\s*background: #FF1E38 !important;\n\s*color: #000000 !important;/g,
  ".theme-cyber-neon .specialty-badge.active,\n  .theme-cyber-neon .category-filter-btn.active {\n    background: #FF1E38 !important;\n    color: #FFFFFF !important;"
);

// Add border to primary action button
css = css.replace(
  /border: none !important;\n\s*border-radius: 12px !important;/g,
  "border: 1px solid #FF1E38 !important;\n    border-radius: 12px !important;"
);

fs.writeFileSync('src/index.css', css);
