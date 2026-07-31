const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

// First, we remove the two effects. 
// It's a bit complex, let's just find the indices.
const fileLines = content.split('\n');

let firstEffectStart = -1;
let firstEffectEnd = -1;
let secondEffectStart = -1;
let secondEffectEnd = -1;

for (let i = 0; i < fileLines.length; i++) {
    if (fileLines[i].includes('useEffect(() => {') && fileLines[i+1].includes('let unsubscribe = () => {};') && fileLines[i+2].includes("const localUid = localStorage.getItem('demoUserId');")) {
        firstEffectStart = i;
    }
    // we know first effect ends at `  }, [id]);`
    if (firstEffectStart !== -1 && firstEffectEnd === -1 && fileLines[i].includes('  }, [id]);')) {
        firstEffectEnd = i;
    }
    
    if (fileLines[i].includes('useEffect(() => {') && fileLines[i+1].includes('let authUnsub = () => {};') && fileLines[i+2].includes('const fetchTattoos = async (authUid: string | undefined) => {')) {
        secondEffectStart = i;
    }
    // second effect ends at `  }, [id]);`
    if (secondEffectStart !== -1 && secondEffectEnd === -1 && i > secondEffectStart && fileLines[i].includes('  }, [id]);')) {
        secondEffectEnd = i;
    }
}

console.log('first:', firstEffectStart, firstEffectEnd);
console.log('second:', secondEffectStart, secondEffectEnd);

