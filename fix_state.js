import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const [activeCategory, setActiveCategory] = useState("All");
  const [showMore, setShowMore] = useState(false);`;

const rep = `  const [activeCategory, setActiveCategory] = useState("All");
  const [showMore, setShowMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);`;

code = code.replace(target, rep);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
