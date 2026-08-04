const fs = require('fs');
let content = fs.readFileSync('src/components/OptimizedImage.tsx', 'utf-8');

content = content.replace(
    /src=\{isVisible \? currentSrc : \(lowResUrl \|\| ''\)\}/,
    "src={isVisible ? currentSrc : (lowResUrl || undefined)}"
);

fs.writeFileSync('src/components/OptimizedImage.tsx', content);
console.log("Patched OptimizedImage successfully!");
