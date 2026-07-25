const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// Insert import
if (!content.includes("react-helmet-async")) {
    content = content.replace(
        "import React, { useState, useEffect } from 'react';",
        "import React, { useState, useEffect } from 'react';\nimport { Helmet } from 'react-helmet-async';"
    );
}

// Extract artist name and bio for the helmet tags
// At line 407: return (
// We can insert the <Helmet> right after return ( <div ...>

const target = `  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen">`;

const replacement = `  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen">
      <Helmet>
        <title>{artistData?.displayName ? \`\${artistData.displayName} - Turnos Tattoo\` : 'Perfil de Artista - Turnos Tattoo'}</title>
        <meta name="description" content={artistData?.bio || 'Conoce a este increíble artista del tatuaje y explora su portafolio en Turnos Tattoo.'} />
        <meta property="og:title" content={artistData?.displayName ? \`\${artistData.displayName} - Portafolio de Tatuajes\` : 'Perfil de Artista - Turnos Tattoo'} />
        <meta property="og:description" content={artistData?.bio || 'Explora el portafolio y reserva tu turno.'} />
        <meta property="og:image" content={artistData?.profilePhotoUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuByR4NUyVVJG5GuLGaRtqWjpCad-ssRG7wJNZiOOJeHykIY9S2eAKXt_nFpI-7F2iK5qdsDhGuFSANZwR96NefHXWFWgkMa2FidlBxVLFU0DO3Khup5Pf9Q_MG-vp8HknfP7FmcKogpQ_BM5vOFw6n1k1mUehIFrxuYqUYBYIOy7jV2RuELrtSHo6ByyE3njg-7BtFcOAWsX8GRbNlrtZ82vz663Cvn1wbr_619qMHrZiTBEOFbX9yhCv1oiB67MwD68MZWnGOjnHo'} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
