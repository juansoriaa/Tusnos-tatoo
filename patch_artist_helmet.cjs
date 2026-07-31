const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf-8');

const regex = /<Helmet>.*?<\/Helmet>/s;
const newHelmet = `<Helmet>
        <title>{artistData?.displayName ? \`\${artistData.displayName} - Turnos Tattoo\` : 'Perfil de Artista - Turnos Tattoo'}</title>
        <meta name="description" content={artistData?.bio || defaultBio} />
        <meta property="og:title" content={artistData?.displayName ? \`\${artistData.displayName} - Turnos Tattoo\` : 'Perfil de Artista - Turnos Tattoo'} />
        <meta property="og:description" content={artistData?.bio || 'Explora el portafolio y reserva tu turno.'} />
        <meta property="og:image" content={defaultAvatar} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href={defaultAvatar} />
        <link rel="apple-touch-icon" href={defaultAvatar} />
      </Helmet>`;

content = content.replace(regex, newHelmet);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
console.log("Patched ArtistProfile.tsx successfully!");
