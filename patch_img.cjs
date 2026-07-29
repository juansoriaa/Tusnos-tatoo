const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /import \{ useSearchParams \} from 'react-router-dom';/,
    `import { useSearchParams } from 'react-router-dom';
import { ProgressiveImage } from './ProgressiveImage';`
);

code = code.replace(
    /import \{ useNavigate, useParams, useSearchParams \} from 'react-router-dom';/,
    `import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ProgressiveImage } from './ProgressiveImage';`
);

code = code.replace(
    /<img\s*className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer object-cover aspect-square"\s*alt=\{tattoo\.alt\}\s*onClick=\{\(\) => openModal\(index\)\}\s*src=\{tattoo\.thumbnailUrl \|\| tattoo\.src\}\s*style=\{\{ filter: getFilterStr\(tattoo\.filters\) \}\}\s*\/>/g,
    `<ProgressiveImage 
                  className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer object-cover aspect-square" 
                  alt={tattoo.alt} 
                  onClick={() => openModal(index)} 
                  thumbnailUrl={tattoo.thumbnailUrl}
                  highResUrl={tattoo.src || tattoo.thumbnailUrl} 
                  style={{ filter: getFilterStr(tattoo.filters) }}
                />`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
