const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const oldFetchCall = `    fetchTattoos();
  }, [id]);`;

const newFetchCall = `    fetchTattoos();

    const handleProfileDataChanged = () => {
        fetchTattoos();
    };

    window.addEventListener('profileDataChanged', handleProfileDataChanged);
    return () => {
        window.removeEventListener('profileDataChanged', handleProfileDataChanged);
    };
  }, [id]);`;

content = content.replace(oldFetchCall, newFetchCall);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
