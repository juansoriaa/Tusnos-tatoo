const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
content = content.replace(
  "import { useNavigate, useParams } from 'react-router-dom';",
  "import { useNavigate, useParams, useSearchParams } from 'react-router-dom';"
);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
