import fs from 'fs';

// 1. Add 'social-btn' class to the social links in ArtistProfile.tsx
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
code = code.replace(
  /className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white"/g,
  'className="w-12 h-12 flex items-center justify-center rounded-full border border-outline-variant hover:border-primary text-on-surface-variant transition-all hover:text-white hover:bg-primary/10 social-btn"'
);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);

// 2. Add specific styles to src/index.css
let css = fs.readFileSync('src/index.css', 'utf8');

// For pink neon
if (!css.includes('.theme-pink-neon .social-btn')) {
    css = css.replace(
      /\.theme-pink-neon \.category-filter-btn \{/,
      ".theme-pink-neon .social-btn {\n" +
      "  border-color: rgba(255, 42, 133, 0.5);\n" +
      "  color: rgba(255, 255, 255, 0.85);\n" +
      "  background: rgba(255, 42, 133, 0.05);\n" +
      "}\n" +
      ".theme-pink-neon .social-btn:hover {\n" +
      "  background: rgba(255, 42, 133, 0.2);\n" +
      "  color: #fff;\n" +
      "  box-shadow: 0 0 10px rgba(255, 42, 133, 0.3);\n" +
      "}\n" +
      ".theme-pink-neon .category-filter-btn {"
    );
}

// For cyber neon
if (!css.includes('.theme-cyber-neon .social-btn')) {
    css = css.replace(
      /\.theme-cyber-neon \.category-filter-btn \{/,
      ".theme-cyber-neon .social-btn {\n" +
      "  border-color: rgba(0, 255, 255, 0.5);\n" +
      "  color: rgba(255, 255, 255, 0.85);\n" +
      "  background: rgba(0, 255, 255, 0.05);\n" +
      "}\n" +
      ".theme-cyber-neon .social-btn:hover {\n" +
      "  background: rgba(0, 255, 255, 0.2);\n" +
      "  color: #fff;\n" +
      "  box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);\n" +
      "}\n" +
      ".theme-cyber-neon .category-filter-btn {"
    );
}

// For minimal clean
if (!css.includes('.theme-minimal-clean .social-btn')) {
    css = css.replace(
      /\.theme-minimal-clean \.profile-photo-container \{/,
      ".theme-minimal-clean .social-btn {\n" +
      "  border-color: rgba(17, 17, 17, 0.2);\n" +
      "  color: #111111;\n" +
      "  background: rgba(17, 17, 17, 0.03);\n" +
      "}\n" +
      ".theme-minimal-clean .social-btn:hover {\n" +
      "  background: rgba(17, 17, 17, 0.08);\n" +
      "  color: #111111 !important;\n" +
      "}\n" +
      ".theme-minimal-clean .profile-photo-container {"
    );
}

fs.writeFileSync('src/index.css', css);
