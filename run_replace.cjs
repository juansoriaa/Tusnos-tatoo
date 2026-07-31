const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');
const replacement = fs.readFileSync('replacement_fetch.tsx', 'utf-8');

const fileLines = content.split('\n');

let startIndex = -1;
for (let i = 0; i < fileLines.length; i++) {
    if (fileLines[i].includes('useEffect(() => {') && fileLines[i+1].includes('let unsubscribe = () => {};')) {
        startIndex = i;
        break;
    }
}

let endIndex = -1;
if (startIndex !== -1) {
    for (let i = startIndex + 1; i < fileLines.length; i++) {
        if (fileLines[i].includes('  }, [id]);')) {
            // Find the SECOND one (because there were two effects)
            if (endIndex === -1) {
                // This is the first one, keep going
                endIndex = -2;
            } else if (endIndex === -2) {
                // This is the second one!
                endIndex = i;
                break;
            }
        }
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    const linesBefore = fileLines.slice(0, startIndex);
    const linesAfter = fileLines.slice(endIndex + 1);
    
    const newContent = linesBefore.join('\n') + '\n' + replacement + '\n' + linesAfter.join('\n');
    fs.writeFileSync('src/components/ArtistProfile.tsx', newContent);
    console.log('Successfully replaced lines', startIndex, 'to', endIndex);
} else {
    console.log('Could not find bounds to replace', startIndex, endIndex);
}
