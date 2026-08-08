import fs from 'fs';
let cssCode = fs.readFileSync('src/index.css', 'utf8');

// Remove the duplicated injections
cssCode = cssCode.replace(/\.theme-minimal-clean \.banner-overlay-1 \{ display: none !important; \}
  \.theme-minimal-clean \.banner-overlay-2 \{ background: linear-gradient\(to top, var\(--color-background\), transparent\) !important; \}
  \.theme-minimal-clean \.profile-logo-container \{ background: #000000 !important; border: 1px solid #000000 !important; \}
  \.theme-minimal-clean \.profile-logo-text \{ color: #FFFFFF !important; \}
  \.theme-minimal-clean \.profile-logo-primary \{ color: #FFFFFF !important; \}

  \/\* ========================================================/g, '/* ========================================================');

// Insert it just once before the ESTILO 1 header
cssCode = cssCode.replace(
  /\/\* ========================================================\n     ESTILO 1: Minimal Clean & Professional/g,
  `.theme-minimal-clean .banner-overlay-1 { display: none !important; }
  .theme-minimal-clean .banner-overlay-2 { background: linear-gradient(to top, var(--color-background), transparent) !important; }
  .theme-minimal-clean .profile-logo-container { background: #000000 !important; border: 1px solid #000000 !important; }
  .theme-minimal-clean .profile-logo-text { color: #FFFFFF !important; }
  .theme-minimal-clean .profile-logo-primary { color: #FFFFFF !important; }

  /* ========================================================
     ESTILO 1: Minimal Clean & Professional`
);

fs.writeFileSync('src/index.css', cssCode);
