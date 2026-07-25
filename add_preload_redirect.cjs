const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const { id } = useParams();
  const [artistData, setArtistData] = useState<any>(() => {`;

const replacement = `  const { id } = useParams();

  useEffect(() => {
    if (!sessionStorage.getItem('preloaded_' + (id || 'demo'))) {
      navigate(id ? '/demo/preload/' + id : '/demo/preload', { replace: true });
    }
  }, [navigate, id]);

  const [artistData, setArtistData] = useState<any>(() => {`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
