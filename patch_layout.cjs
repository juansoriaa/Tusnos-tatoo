const fs = require('fs');

let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf-8');

// Add import
content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { Helmet } from 'react-helmet-async';");

// Add state
const statePattern = "    const [turnosLlenos, setTurnosLlenos] = useState(false);";
const newState = `    const [turnosLlenos, setTurnosLlenos] = useState(false);\n    const [artistName, setArtistName] = useState('Artista');\n    const [artistBio, setArtistBio] = useState('Panel de Control - Turnos Tattoo');`;
content = content.replace(statePattern, newState);

// Update fetch
const fetchPattern = "                        if (data.profilePhotoUrl) setAvatarUrl(data.profilePhotoUrl);";
const newFetch = `                        if (data.profilePhotoUrl) setAvatarUrl(data.profilePhotoUrl);\n                        if (data.displayName) setArtistName(data.displayName);\n                        if (data.bio) setArtistBio(data.bio);`;
content = content.replace(fetchPattern, newFetch);

// Update return to include Helmet
const returnPattern = `    return (
        <div className="bg-deep-black text-silver-text font-body-md h-[100dvh] overflow-hidden flex text-[#e5e2e1] bg-[#050505]">`;
const newReturn = `    return (
        <div className="bg-deep-black text-silver-text font-body-md h-[100dvh] overflow-hidden flex text-[#e5e2e1] bg-[#050505]">
            <Helmet>
                <title>{artistName} - Panel de Control</title>
                <meta name="description" content={artistBio} />
                <link rel="icon" href={avatarUrl} />
                <link rel="apple-touch-icon" href={avatarUrl} />
            </Helmet>`;
content = content.replace(returnPattern, newReturn);

fs.writeFileSync('src/components/DemoLayout.tsx', content);
