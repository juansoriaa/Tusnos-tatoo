const fs = require('fs');

let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf-8');

const regex = /<Helmet>.*?<\/Helmet>/s;
const newHelmet = `<Helmet>
                <title>Panel Privado - {artistName} | Turnos Tattoo</title>
                <meta name="description" content={artistBio} />
                <link rel="icon" href={avatarUrl} />
                <link rel="apple-touch-icon" href={avatarUrl} />
            </Helmet>`;

content = content.replace(regex, newHelmet);
fs.writeFileSync('src/components/DemoLayout.tsx', content);
console.log("Patched DemoLayout.tsx successfully!");
