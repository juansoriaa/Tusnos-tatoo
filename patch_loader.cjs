const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// The block to replace starts at:
//   useEffect(() => {
//     let unsubscribe = () => {};
// And ends at:
//         window.removeEventListener("profileDataChanged", handleProfileDataChanged);
//     };
//   }, [id]);

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
        if (fileLines[i].includes('}, [id]);')) {
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

console.log(startIndex, endIndex);

