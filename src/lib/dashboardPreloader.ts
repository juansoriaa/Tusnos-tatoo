import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { globalPreloadCache } from './cache';

let activePreloadUid: string | null = null;
let preloadTimeout: any = null;

export const preloadDashboardData = (uid: string) => {
    if (activePreloadUid === uid) return; // Already preloaded or preloading
    activePreloadUid = uid;
    
    // Slight delay to prioritize main render
    if (preloadTimeout) clearTimeout(preloadTimeout);
    preloadTimeout = setTimeout(async () => {
        if (activePreloadUid !== uid) return;
        
        try {
            // 1. Profile Data (also used for Dashboard Settings)
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (activePreloadUid !== uid) return;
            let artistData = null;
            if (userDoc.exists()) {
                const data = userDoc.data();
                artistData = { ...data, uid: userDoc.id };
                localStorage.setItem('demoArtistData_' + uid, JSON.stringify(artistData));
                globalPreloadCache[uid] = { ...globalPreloadCache[uid], artistData };
            }
            
            // 2. Portfolio Photos
            const qPhotos = query(collection(db, 'photos'), where('createdBy', '==', uid), orderBy('createdAt', 'desc'));
            const photosSnap = await getDocs(qPhotos);
            if (activePreloadUid !== uid) return;
            
            let photos = photosSnap.docs.map(d => {
                const data = d.data();
                return {
                    id: d.id,
                    src: data.url || data.imageUrl || data.src,
                    thumbnailUrl: data.thumbnailUrl,
                    alt: data.info || data.title,
                    title: data.title || 'Foto de Tatuaje',
                    categories: data.tags || data.categories || ['Portfolio'],
                    filters: data.filters || [],
                    hours: data.hours,
                    sessions: data.sessions,
                    size: data.size,
                    pinnedOrder: data.pinnedOrder,
                    originalFallbackId: data.originalFallbackId
                };
            });
            
            // Sort to match Profile logic (pinned first)
            photos.sort((a, b) => {
                const aPinned = typeof a.pinnedOrder === 'number' && a.pinnedOrder > 0;
                const bPinned = typeof b.pinnedOrder === 'number' && b.pinnedOrder > 0;
                if (aPinned && bPinned) return a.pinnedOrder - b.pinnedOrder;
                if (aPinned) return -1;
                if (bPinned) return 1;
                return 0; 
            });

            localStorage.setItem('demoAllTattoos_' + uid, JSON.stringify(photos));
            globalPreloadCache[uid] = { ...globalPreloadCache[uid], allTattoos: photos };
            
            // 3. Appointments (Dashboard)
            const qAppt = query(collection(db, 'users', uid, 'appointments'));
            const apptSnap = await getDocs(qAppt);
            if (activePreloadUid !== uid) return;
            const appts = apptSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            localStorage.setItem('demoAppointments_' + uid, JSON.stringify(appts));
            globalPreloadCache[uid] = { ...globalPreloadCache[uid], appointments: appts };

            // 4. Waitlist (Dashboard)
            const qWait = query(collection(db, 'users', uid, 'waitlist'));
            const waitSnap = await getDocs(qWait);
            if (activePreloadUid !== uid) return;
            const waitlist = waitSnap.docs.map(d => ({ id: d.id, ...d.data() }));
            localStorage.setItem('demoWaitlist_' + uid, JSON.stringify(waitlist));
            globalPreloadCache[uid] = { ...globalPreloadCache[uid], waitlist };

        } catch (e) {
            console.error('Preload error:', e);
        }
    }, 100);
};

export const clearDashboardPreload = () => {
    activePreloadUid = null;
    if (preloadTimeout) clearTimeout(preloadTimeout);
    
    // Clear the keys from localStorage (optional, to save space when leaving)
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('demoArtistData_') || key.startsWith('demoAllTattoos_') || key.startsWith('demoAppointments_') || key.startsWith('demoWaitlist_'))) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    
    // Clear global cache
    for (let key in globalPreloadCache) {
        delete globalPreloadCache[key];
    }
};
