const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const target = `        if (!artistUid && auth.currentUser) {
            artistUid = auth.currentUser.uid;
        } else if (!artistUid) {
            artistUid = 'anonymous_demo';
        }`;

const replacement = `        if (!artistUid && auth.currentUser) {
            artistUid = auth.currentUser.uid;
        } else if (!artistUid) {
            artistUid = 'anonymous_demo';
        }

        // Fetch artist profile data for preload display
        if (artistUid !== 'anonymous_demo') {
           const userDoc = await getDoc(doc(db, 'users', artistUid));
           if (userDoc.exists()) {
               const data = userDoc.data();
               if (data.displayName) setArtistName(data.displayName);
               if (data.specialtyTags && data.specialtyTags.length > 0) setSpecialties(data.specialtyTags);
               if (data.profilePhotoUrl) setProfilePhotoUrl(data.profilePhotoUrl);
               localStorage.setItem('demoArtistData', JSON.stringify(data));
           }
        }`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Preload.tsx', content);
