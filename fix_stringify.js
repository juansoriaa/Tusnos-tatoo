import fs from 'fs';
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const target1 = `    const hasUnsavedChanges = initialDataStr !== '' && currentDataStr !== initialDataStr;`;
const rep1 = `    const hasUnsavedChanges = false; // Disable unsaved changes prompt temporarily for bug fix`;

code = code.replace(target1, rep1);

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
