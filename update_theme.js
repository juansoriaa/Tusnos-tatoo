import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf8');

// Replace the entire .theme-cyber-neon block with .theme-crimson-underground block
const oldCyberRegex = /\.theme-cyber-neon \{[\s\S]*?\}(?=[\s\S]*?\.theme-minimal-clean)/;

// Wait, looking at the previous grep, .theme-cyber-neon starts at 591, and continues with .theme-cyber-neon ...
