const fs = require('fs');
let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const startIndex = file.indexOf('const applyData = (data: any) => {');
const endIndexStr = "} catch (e) { console.error('Error in applyData', e); }\n        };";
const endIndex = file.indexOf(endIndexStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const applyDataCode = file.substring(startIndex, endIndex + endIndexStr.length);
    file = file.replace(applyDataCode, '');
    
    file = file.replace(
        /const localUid = localStorage\.getItem\('demoUserId'\);/,
        `${applyDataCode}\n        const localUid = localStorage.getItem('demoUserId');`
    );
    
    fs.writeFileSync('src/components/DemoDashboard.tsx', file);
    console.log('Fixed TDZ bug');
} else {
    console.log('Could not find indices', startIndex, endIndex);
}
