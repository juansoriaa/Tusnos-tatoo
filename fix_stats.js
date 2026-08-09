import fs from 'fs';
let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  /\.theme-minimal-clean \.tech-stat-card \{\n    background: #FFFFFF !important;\n    border: 1px solid #EFEFF4 !important;\n  \}/,
  ".theme-minimal-clean .tech-stat-card {\n" +
  "    background: #FFFFFF !important;\n" +
  "    border: 1px solid #EFEFF4 !important;\n" +
  "  }\n" +
  "  .theme-minimal-clean .tech-stat-card span.text-white {\n" +
  "    color: #111111 !important;\n" +
  "  }\n" +
  "  .theme-minimal-clean .tech-stat-card span.text-white\\/70 {\n" +
  "    color: #666666 !important;\n" +
  "  }"
);
fs.writeFileSync('src/index.css', css);
