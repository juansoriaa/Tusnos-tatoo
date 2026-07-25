const fs = require('fs');

// 1. Update DemoDashboard.tsx
let dashboard = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const saveTarget = `onClick={() => alert("Cambios guardados exitosamente!")}`;
const newSave = `onClick={() => {
                                    const demoData = {
                                        displayName: name,
                                        bio: bio,
                                        specialtyTags: [specialty1, specialty2, specialty3].filter(Boolean),
                                        isAvailable: isAvailable,
                                        whatsapp: whatsapp,
                                        instagram: instagram,
                                        facebook: facebook,
                                        mapLink: mapLink
                                    };
                                    localStorage.setItem('demoArtistData', JSON.stringify(demoData));
                                    alert("Cambios guardados exitosamente!");
                                }}`;
dashboard = dashboard.replace(saveTarget, newSave);

const useEffectTarget = `const [modalOpen, setModalOpen] = useState<string | null>(null);`;
const newUseEffect = `const [modalOpen, setModalOpen] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('demoArtistData');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setName(data.displayName || '');
                setBio(data.bio || '');
                setSpecialty1(data.specialtyTags?.[0] || '');
                setSpecialty2(data.specialtyTags?.[1] || '');
                setSpecialty3(data.specialtyTags?.[2] || '');
                setIsAvailable(data.isAvailable !== false);
                setWhatsapp(data.whatsapp || '');
                setInstagram(data.instagram || '');
                setFacebook(data.facebook || '');
                setMapLink(data.mapLink || '');
            } catch (e) {}
        }
    }, []);`;
dashboard = dashboard.replace(useEffectTarget, newUseEffect);

fs.writeFileSync('src/components/DemoDashboard.tsx', dashboard);

// 2. Update ArtistProfile.tsx
let profile = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const fetchTarget = `if (id) {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtistData(docSnap.data());
        }
      }`;

const newFetch = `if (id) {
        const docRef = doc(db, 'users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setArtistData(docSnap.data());
        }
      } else {
        const saved = localStorage.getItem('demoArtistData');
        if (saved) {
            try {
                setArtistData(JSON.parse(saved));
            } catch (e) {}
        }
      }`;

if (!profile.includes("localStorage.getItem('demoArtistData')")) {
    profile = profile.replace(fetchTarget, newFetch);
    fs.writeFileSync('src/components/ArtistProfile.tsx', profile);
}

