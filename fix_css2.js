import fs from 'fs';
let cssCode = fs.readFileSync('src/index.css', 'utf8');

cssCode = cssCode.replace(
  /\.theme-minimal-clean \.stat-icon \{/g,
  `.theme-minimal-clean .tech-stat-card {
    background: #FFFFFF !important;
    border: 1px solid #EFEFF4 !important;
  }
  .theme-minimal-clean .stat-icon {`
);

fs.writeFileSync('src/index.css', cssCode);
