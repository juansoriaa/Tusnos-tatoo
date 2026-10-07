const fs = require('fs');

let file = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// The safest way is to replace the whole block by finding its start and end
const startStr = '// Sincronización entre pestañas y descongelación del navegador';
const startIndex = file.indexOf('// Sincronizaci');
if (startIndex !== -1) {
    // Find the end of the useEffect
    const nextUseEffect = file.indexOf('const [name, setName]', startIndex);
    if (nextUseEffect !== -1) {
        file = file.substring(0, startIndex) + file.substring(nextUseEffect);
        fs.writeFileSync('src/components/DemoDashboard.tsx', file);
        console.log('Successfully deleted syncFromStorage useEffect');
    } else {
        console.log('Could not find next hook');
    }
} else {
    console.log('Could not find start str');
}
