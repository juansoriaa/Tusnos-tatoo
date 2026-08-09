import fs from 'fs';

let css = fs.readFileSync('src/index.css', 'utf8');

// Replace hex codes for cyber neon to crimson
// Primary: #00F0FF -> #FF1E38
// Container: #0077FF -> #B91C1C
// RGB: 0, 240, 255 -> 255, 30, 56
// Also border-radius for buttons and cards: 4px -> 8px (to be moderately rounded as requested)

// First, we extract the part of the CSS that belongs to theme-cyber-neon
const cyberNeonPartStart = css.indexOf('.theme-cyber-neon {');
const cyberNeonPartEnd = css.lastIndexOf('}'); // Actually, we need to replace globally inside the cyber neon definitions.

// Since the file has other themes, we can just find and replace within lines that contain `.theme-cyber-neon`

let lines = css.split('\n');
let insideCyberNeonBlock = false;

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check if we are inside a theme-cyber-neon block (simplistic block tracking)
    if (line.includes('.theme-cyber-neon')) {
        insideCyberNeonBlock = true;
    }
    
    if (insideCyberNeonBlock) {
        // Replace colors
        line = line.replace(/#00F0FF/gi, '#FF1E38');
        line = line.replace(/#0077FF/gi, '#B91C1C');
        line = line.replace(/0,\s*240,\s*255/g, '255, 30, 56');
        line = line.replace(/0,\s*255,\s*255/g, '255, 30, 56'); // For social btn which might have used 0, 255, 255
        
        // "Tarjetas de Tatuajes: ... esquinas moderadamente redondeadas"
        if (line.includes('border-radius: 4px')) {
            line = line.replace('border-radius: 4px', 'border-radius: 8px');
        }

        // Font family for the whole theme
        if (line.includes('.theme-cyber-neon {')) {
             // We can add font-family here later, but let's just do it cleanly
        }
        
        lines[i] = line;
    }
    
    // Basic block exit logic
    if (insideCyberNeonBlock && line.trim() === '}' && !lines[i-1].includes('}')) {
        // This is tricky because of nested structures or at-rules, but cyber-neon blocks in components layer are mostly flat.
        // Actually, we can just replace globally on any line that contains `.theme-cyber-neon` or if it's the block
    }
}

// A safer way is to just use regex for the whole file, but only for cyber-neon
// Let's just use string replace on the whole file for the specific cyber neon block

let newCss = fs.readFileSync('src/index.css', 'utf8');

// The first definition:
newCss = newCss.replace(
/(\.theme-cyber-neon\s*\{[^}]*\})/g,
function(match) {
    let res = match.replace(/#00F0FF/gi, '#FF1E38');
    res = res.replace(/#0077FF/gi, '#B91C1C');
    res = res.replace(/0,\s*240,\s*255/g, '255, 30, 56');
    res = res.replace(/0,\s*255,\s*255/g, '255, 30, 56');
    // Add font-family
    if (res.includes('--color-primary')) {
        res = res.replace('--color-primary', "font-family: 'Space Grotesk', 'Syne', 'Inter', sans-serif;\n    --color-primary");
    }
    return res;
});

// The components part:
// Since there are multiple blocks like `.theme-cyber-neon .profile-photo-container { ... }`
// We can use a regex to match all `.theme-cyber-neon ... { ... }` blocks
newCss = newCss.replace(
/(\.theme-cyber-neon[^\{]*\{[^}]*\})/g,
function(match) {
    let res = match.replace(/#00F0FF/gi, '#FF1E38');
    res = res.replace(/#0077FF/gi, '#B91C1C');
    res = res.replace(/0,\s*240,\s*255/g, '255, 30, 56');
    res = res.replace(/0,\s*255,\s*255/g, '255, 30, 56');
    res = res.replace(/border-radius:\s*4px/g, 'border-radius: 12px');
    return res;
});

// Update the title comment
newCss = newCss.replace(/ESTILO 2: Cyber Dark & Electric Neon/, 'ESTILO 2: Dark Crimson & Electric Underground');

fs.writeFileSync('src/index.css', newCss);
