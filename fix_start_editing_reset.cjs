const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const target = "setResetUploader(prev => prev + 1);\n        setTimeout(() => {\n            document.getElementById('subir-obra-section')?.scrollIntoView({ behavior: 'smooth' });\n        }, 100);";
const replacement = "setTimeout(() => {\n            document.getElementById('subir-obra-section')?.scrollIntoView({ behavior: 'smooth' });\n        }, 100);";

content = content.replace(target, replacement);

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
