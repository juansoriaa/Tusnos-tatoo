const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');
content = content.replace(/e\.preventDefault\(\);\n                                                        const newFaqs = faqs/g, 'e.stopPropagation();\n                                                        const newFaqs = faqs');
fs.writeFileSync('src/components/DemoDashboard.tsx', content);
