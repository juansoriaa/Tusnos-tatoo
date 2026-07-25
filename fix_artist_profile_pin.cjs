const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const oldMap = `const photos = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    src: data.url,
                    thumbnailUrl: data.thumbnailUrl,
                    alt: data.info || data.title,
                    title: data.title,
                    categories: data.tags || [],
                    filters: data.filters,
                    hours: data.hours,
                    sessions: data.sessions,
                    size: data.size
                };
            });`;

const newMap = `const photos = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    src: data.url,
                    thumbnailUrl: data.thumbnailUrl,
                    alt: data.info || data.title,
                    title: data.title,
                    categories: data.tags || [],
                    filters: data.filters,
                    hours: data.hours,
                    sessions: data.sessions,
                    size: data.size,
                    pinnedOrder: data.pinnedOrder
                };
            });`;

content = content.replace(oldMap, newMap);

const oldSetTattoos = `setAllTattoos([...photos, ...fallback]);`;
const newSetTattoos = `const allTatts = [...photos, ...fallback];
            // Sort to bring pinned tattoos to the top
            allTatts.sort((a, b) => {
                const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;
                const bPinned = typeof b.pinnedOrder === 'number' && b.pinnedOrder > 0;
                if (aPinned && bPinned) return a.pinnedOrder - b.pinnedOrder;
                if (aPinned) return -1;
                if (bPinned) return 1;
                return 0; // fallback to original order (which is desc createdAt)
            });
            setAllTattoos(allTatts);`;

content = content.replace(oldSetTattoos, newSetTattoos);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
