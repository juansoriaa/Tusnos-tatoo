const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

const oldArtistFetch = `  useEffect(() => {
    let unsubscribe = () => {};
    const localUid = localStorage.getItem('demoUserId');
    if (localUid) {
        fetchArtist({uid: localUid});
    } else {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            fetchArtist(user);
        });
    }`;

const newArtistFetch = `  useEffect(() => {
    let unsubscribe = () => {};
    const localUid = localStorage.getItem('demoUserId');
    if (id) {
        fetchArtist();
    } else if (localUid) {
        fetchArtist({uid: localUid});
    } else {
        unsubscribe = onAuthStateChanged(auth, (user) => {
            fetchArtist(user);
        });
    }`;

const oldTattoosFetch = `    const localUid = localStorage.getItem('demoUserId');
    if (localUid) {
        fetchTattoos(localUid);
    } else {
        authUnsub = onAuthStateChanged(auth, (user) => {
            fetchTattoos(user?.uid);
        });
    }`;

const newTattoosFetch = `    const localUid = localStorage.getItem('demoUserId');
    if (id) {
        fetchTattoos(undefined);
    } else if (localUid) {
        fetchTattoos(localUid);
    } else {
        authUnsub = onAuthStateChanged(auth, (user) => {
            fetchTattoos(user?.uid);
        });
    }`;

content = content.replace(oldArtistFetch, newArtistFetch);
content = content.replace(oldTattoosFetch, newTattoosFetch);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
