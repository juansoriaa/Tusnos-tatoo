import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `                    const qTattoos = query(
                        collection(db, 'photos'),
                        where('createdBy', '==', artistUid),
                        orderBy('createdAt', 'desc'),
                        limit(20)
                    );
                    const tattoosSnapshot = await getDocs(qTattoos);
                    if (isMounted) {
                        let finalPhotos: any[] = [];
                        finalPhotos = tattoosSnapshot.docs.map(doc => {`;

const rep = `                    const qTattoos = query(
                        collection(db, 'photos'),
                        where('createdBy', '==', artistUid),
                        orderBy('createdAt', 'desc'),
                        limit(12)
                    );
                    const tattoosSnapshot = await getDocs(qTattoos);
                    if (isMounted) {
                        if (tattoosSnapshot.docs.length > 0) {
                            setLastDoc(tattoosSnapshot.docs[tattoosSnapshot.docs.length - 1]);
                        }
                        if (tattoosSnapshot.docs.length < 12) {
                            setHasMore(false);
                        }
                        let finalPhotos: any[] = [];
                        finalPhotos = tattoosSnapshot.docs.map(doc => {`;

code = code.replace(target, rep);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
