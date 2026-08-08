import fs from 'fs';
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// Replace the stringify check with a deep equality check
const target = `    const hasUnsavedChanges = initialDataStr !== '' && currentDataStr !== initialDataStr;
    if (hasUnsavedChanges) {
      console.log('UNSAVED CHANGES DETECTED:');
      console.log('Initial:', initialDataStr);
      console.log('Current:', currentDataStr);
    }`;

const rep = `    let hasUnsavedChanges = false;
    if (initialDataStr !== '') {
        try {
            const initialData = JSON.parse(initialDataStr);
            for (const key in currentData) {
                if (JSON.stringify(currentData[key]) !== JSON.stringify(initialData[key])) {
                    hasUnsavedChanges = true;
                    break;
                }
            }
        } catch(e) {}
    }`;

code = code.replace(target, rep);

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
