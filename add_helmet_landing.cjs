const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf8');

// Insert import
if (!content.includes("react-helmet-async")) {
    content = content.replace(
        "import React, { useEffect, useState } from 'react';",
        "import React, { useEffect, useState } from 'react';\nimport { Helmet } from 'react-helmet-async';"
    );
}

const target = `  return (
    <>`;

const replacement = `  return (
    <>
      <Helmet>
        <title>Turnos Tattoo - Software de Gestión para Artistas del Tatuaje</title>
        <meta name="description" content="Turnos Tattoo es la plataforma ideal para tatuadores. Gestiona tus turnos, exhibe tu portafolio y optimiza tu negocio de forma fácil y profesional." />
        <meta property="og:title" content="Turnos Tattoo - Software de Gestión para Tatuadores" />
        <meta property="og:description" content="Lleva tu estudio de tatuajes al siguiente nivel con Turnos Tattoo." />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Landing.tsx', content);
