import fs from 'fs';
let cssCode = fs.readFileSync('src/index.css', 'utf8');

cssCode = cssCode.replace(
  /--color-surface-variant: #FFFFFF;/g,
  `--color-surface-variant: #FFFFFF;
    --color-surface-container-low: #FFFFFF;
    --color-surface-container-high: #F9F9FB;
    --color-surface-container-highest: #EFEFF4;`
);

cssCode = cssCode.replace(
  /\/\* ========================================================/g,
  `.theme-minimal-clean .banner-overlay-1 { display: none !important; }
  .theme-minimal-clean .banner-overlay-2 { background: linear-gradient(to top, var(--color-background), transparent) !important; }
  .theme-minimal-clean .profile-logo-container { background: #000000 !important; border: 1px solid #000000 !important; }
  .theme-minimal-clean .profile-logo-text { color: #FFFFFF !important; }
  .theme-minimal-clean .profile-logo-primary { color: #FFFFFF !important; }

  /* ========================================================`
);

fs.writeFileSync('src/index.css', cssCode);
