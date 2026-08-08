import fs from 'fs';

let cssCode = fs.readFileSync('src/index.css', 'utf8');

cssCode = cssCode.replace(
  /\.theme-minimal-clean \.profile-logo-container \{ background: #000000 !important; border: 1px solid #000000 !important; \}/g,
  '.theme-minimal-clean .profile-logo-container { background: rgba(0,0,0,0.4) !important; border: none !important; }'
);

cssCode = cssCode.replace(
  /\.theme-minimal-clean \.profile-logo-text \{ color: #FFFFFF !important; \}/g,
  '.theme-minimal-clean .profile-logo-text { color: rgba(255,255,255,0.7) !important; }'
);

cssCode = cssCode.replace(
  /\.theme-minimal-clean \.profile-logo-primary \{ color: #FFFFFF !important; \}/g,
  '.theme-minimal-clean .profile-logo-primary { color: rgba(255,255,255,0.8) !important; }'
);

fs.writeFileSync('src/index.css', cssCode);
