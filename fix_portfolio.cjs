const fs = require('fs');
let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

content = content.replace('Drag image or click to browse', 'Arrastra la imagen o haz clic para buscar');
content = content.replace('High-res JPG or PNG (Max 5MB)', 'JPG o PNG de alta resolución (Máx 5MB)');
// Check if "Publish to Portfolio" exists
content = content.replace('Publish to Portfolio', 'Publicar en Portafolio');

fs.writeFileSync('src/components/DemoPortfolio.tsx', content);
