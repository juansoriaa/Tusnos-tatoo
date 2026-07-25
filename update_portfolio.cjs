const fs = require('fs');

let content = fs.readFileSync('src/components/DemoPortfolio.tsx', 'utf8');

// Find the start of the specific content
const startMarker = '{/* Restructured Layout */}';
const endMarker = '</main>';

let contentStart = content.indexOf(startMarker);
let contentEnd = content.lastIndexOf(endMarker);

if (contentStart > -1 && contentEnd > -1) {
    let mainContent = content.substring(contentStart, contentEnd);
    // Remove trailing </div></div> from mainContent if it's there
    let newFileContent = `import React from 'react';
import { useNavigate } from 'react-router-dom';
import DemoLayout from './DemoLayout';

export default function DemoPortfolio() {
    return (
        <DemoLayout 
            activeTab="portfolio"
            titlePrefix="Gestión de"
            titleAccent="Portafolio"
            description="Curate your gallery. Manage categories, upload new pieces, and organize your public portfolio with surgical precision."
        >
            ${mainContent}
        </DemoLayout>
    );
}
`;
    fs.writeFileSync('src/components/DemoPortfolio.tsx', newFileContent);
}
