import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target1 = `  const [activeCategory, setActiveCategory] = useState("All");
  const [showMore, setShowMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);`;
const rep1 = `  const [activeCategory, setActiveCategory] = useState("All");
  const [lastDoc, setLastDoc] = useState<any>(null);`;

const target2 = `        const aIndex = allTattoos.findIndex(t => t.id === photoId);
        if (aIndex !== -1) {
          if (activeCategory !== "All") setActiveCategory("All");
          if (!showMore) setShowMore(true);
        }`;
const rep2 = `        const aIndex = allTattoos.findIndex(t => t.id === photoId);
        if (aIndex !== -1) {
          if (activeCategory !== "All") setActiveCategory("All");
        }`;

code = code.replace(target1, rep1).replace(target2, rep2);
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
