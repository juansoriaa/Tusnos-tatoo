const fs = require('fs');

const files = [
    'src/components/ArtistProfile.tsx',
    'src/components/DemoLayout.tsx',
    'src/components/DemoMetrics.tsx',
    'src/components/DemoPortfolio.tsx',
    'src/components/Preload.tsx'
];

files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    // Replace { id: doc.id, ...doc.data() } with { ...doc.data(), id: String(doc.id) }
    // Handles multi-line too
    code = code.replace(/\{\s*id:\s*doc\.id,\s*\.\.\.doc\.data\(\)\s*\}/g, '{ ...doc.data(), id: String(doc.id) }');
    
    // For DemoMetrics: { id: doc.id, ...doc.data() } as any
    code = code.replace(/\{\s*id:\s*doc\.id,\s*\.\.\.doc\.data\(\)\s*\}\s*as\s*any/g, '{ ...doc.data(), id: String(doc.id) } as any');

    // For ArtistProfile / Preload multi-line:
    code = code.replace(/id:\s*doc\.id,\n(\s*)\.\.\.doc\.data\(\)/g, '...doc.data(),\n$1id: String(doc.id)');
    
    fs.writeFileSync(file, code);
});
