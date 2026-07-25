const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

if (!content.includes('import { db, auth }')) {
  content = content.replace(
    "import { useNavigate } from 'react-router-dom';",
    "import { useNavigate, useParams } from 'react-router-dom';\nimport { db, auth } from '../firebase';\nimport { collection, getDocs, query, orderBy, where } from 'firebase/firestore';"
  );
}

content = content.replace(
  "export default function Preload() {",
  "export default function Preload() {\n  const { id } = useParams();"
);

const newEffect = `
  useEffect(() => {
    let isMounted = true;
    let minTimePassed = false;
    let dataLoaded = false;

    const navigateToProfile = () => {
      if (isMounted && minTimePassed && dataLoaded) {
        navigate('/demo/profile' + (id ? '/' + id : ''), { replace: true });
      }
    };

    const timer = setTimeout(() => {
      minTimePassed = true;
      navigateToProfile();
    }, 2000);

    const preloadImages = async () => {
      try {
        let artistUid = id;
        if (!artistUid && auth.currentUser) {
            artistUid = auth.currentUser.uid;
        } else if (!artistUid) {
            artistUid = 'anonymous_demo';
        }

        const q = query(
            collection(db, 'photos'),
            where('createdBy', '==', artistUid),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const urlsToPreload = snapshot.docs.map(doc => {
            const data = doc.data();
            return data.thumbnailUrl || data.url;
        }).filter(url => url);

        // Also preload the fallback tattoos if there are any, though they're probably fast enough
        // Wait for images to load in browser cache
        await Promise.all(urlsToPreload.map(url => {
          return new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve; // resolve anyway so we don't block
          });
        }));
      } catch (err) {
        console.error('Error preloading images:', err);
      } finally {
        dataLoaded = true;
        navigateToProfile();
      }
    };

    preloadImages();

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [navigate, id]);
`;

content = content.replace(
  /useEffect\(\(\) => \{\s*const timer = setTimeout\(\(\) => \{\s*navigate\('\/demo\/profile'.*?\}, 2000\);\s*return \(\) => clearTimeout\(timer\);\s*\}, \[navigate\]\);/gs,
  newEffect
);

fs.writeFileSync('src/components/Preload.tsx', content);
