const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf-8');

content = content.replace(
    /const hasUnsavedChanges = initialDataStr !== '' && currentDataStr !== initialDataStr;/,
    "const hasUnsavedChanges = initialDataStr !== '' && currentDataStr !== initialDataStr;\n    if (hasUnsavedChanges) {\n      console.log('UNSAVED CHANGES DETECTED:');\n      console.log('Initial:', initialDataStr);\n      console.log('Current:', currentDataStr);\n    }"
);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
console.log("Patched debug successfully!");
