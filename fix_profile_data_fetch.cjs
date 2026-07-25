const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// First remove the broken fetchArtist() call from the second useEffect
content = content.replace(/    const handleProfileDataChanged = \(\) => \{\n        fetchTattoos\(\);\n        fetchArtist\(\);\n    \};/g, "    const handleProfileDataChanged = () => {\n        fetchTattoos();\n    };");

// Now append a listener to the first useEffect
const oldEffect = `    };
    fetchArtist();
  }, [id]);`;

const newEffect = `    };
    fetchArtist();
    
    window.addEventListener('profileDataChanged', fetchArtist);
    return () => {
        window.removeEventListener('profileDataChanged', fetchArtist);
    };
  }, [id]);`;

content = content.replace(oldEffect, newEffect);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
