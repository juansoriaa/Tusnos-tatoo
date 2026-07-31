const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

// Replace description
content = content.replace(
  /<p className="text-gray-400 max-w-2xl mx-auto">Artistas de élite potenciando sus carreras\.<\/p>/,
  '<p className="text-gray-400 max-w-2xl mx-auto">Un lugar donde los tatuadores muestran sus obras con elegancia, estilo y con toda su información de forma profesional.</p>'
);

// Replace src logic in fetchDirectoryWorks
content = content.replace(
  /src: w\.url,/,
  'src: w.url || w.src || w.imageUrl,'
);

fs.writeFileSync('src/components/Landing.tsx', content);
