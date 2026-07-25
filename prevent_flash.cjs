const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const { id } = useParams();

  useEffect(() => {
    if (!sessionStorage.getItem('preloaded_' + (id || 'demo'))) {
      navigate(id ? '/demo/preload/' + id : '/demo/preload', { replace: true });
    }
  }, [navigate, id]);

  const [artistData, setArtistData] = useState<any>(() => {`;

const replacement = `  const { id } = useParams();
  const [shouldPreload] = useState(() => !sessionStorage.getItem('preloaded_' + (id || 'demo')));

  useEffect(() => {
    if (shouldPreload) {
      navigate(id ? '/demo/preload/' + id : '/demo/preload', { replace: true });
    }
  }, [navigate, id, shouldPreload]);

  const [artistData, setArtistData] = useState<any>(() => {`;

content = content.replace(target, replacement);

const returnTarget = `  return (
    <div className="bg-background min-h-screen font-body text-on-surface m-0 p-0 selection:bg-primary/30 selection:text-primary">`;

const returnReplacement = `  if (shouldPreload) return null;

  return (
    <div className="bg-background min-h-screen font-body text-on-surface m-0 p-0 selection:bg-primary/30 selection:text-primary">`;

content = content.replace(returnTarget, returnReplacement);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
