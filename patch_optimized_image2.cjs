const fs = require('fs');
let content = fs.readFileSync('src/components/OptimizedImage.tsx', 'utf-8');

content = content.replace(
    /src=\{isVisible \? currentSrc : \(lowResUrl \|\| undefined\)\}/,
    "src={isVisible ? (currentSrc || undefined) : (lowResUrl || undefined)}"
);

fs.writeFileSync('src/components/OptimizedImage.tsx', content);
console.log("Patched OptimizedImage again successfully!");
