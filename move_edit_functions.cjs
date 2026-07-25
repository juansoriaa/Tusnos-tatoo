const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

const effectSearchStart = "    useEffect(() => {\n        // Fetch existing photos when component mounts\n        \n    const startEditing = (photo: any) => {";

const replacement = "    const startEditing = (photo: any) => {";

content = content.replace(effectSearchStart, replacement);

const fetchPhotosSearch = "    const fetchPhotos = async () => {";
content = content.replace(fetchPhotosSearch, "    useEffect(() => {\n        // Fetch existing photos when component mounts\n    const fetchPhotos = async () => {");

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
