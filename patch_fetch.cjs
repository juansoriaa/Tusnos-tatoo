const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /if \(targetId\) \{[\s\S]*?\} else \{[\s\S]*?\}\s*setIsProfileLoading\(false\);/,
    `try {
      if (targetId) {
        if (!artistData) setIsProfileLoading(true);
        const docRef = doc(db, 'users', targetId);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Include UID to ensure we can identify the user
          setArtistData({ ...data, uid: docSnap.id });
          globalPreloadCache[targetId || 'demo'] = { ...globalPreloadCache[targetId || 'demo'], artistData: { ...data, uid: docSnap.id } };
        } else {
            // Try by userTag
            let tag = targetId;
            if (!tag.startsWith('@')) tag = '@' + tag;
            const q = query(collection(db, 'users'), where('userTag', '==', tag));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const data = querySnapshot.docs[0].data();
                setArtistData({ ...data, uid: querySnapshot.docs[0].id });
                globalPreloadCache[targetId || 'demo'] = { ...globalPreloadCache[targetId || 'demo'], artistData: { ...data, uid: querySnapshot.docs[0].id } };
            }
        }
      } else {
        const saved = localStorage.getItem('demoArtistData_demo');
        if (saved) {
            try {
                setArtistData(JSON.parse(saved));
            } catch (e) {}
        }
      }
    } catch(e) { console.error(e); } finally {
      setIsProfileLoading(false);
    }`
);

// Remove the double fetchArtist() call
code = code.replace(/    \};\s*fetchArtist\(\);\s*const handleProfileDataChanged/, `    };
    const handleProfileDataChanged`);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
