const fs = require('fs');

let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

const regex = /<Helmet>.*?<\/Helmet>/s;
const newHelmet = `<Helmet>
        <title>Turnos Tattoo - Software de Gestión para Artistas del Tatuaje</title>
        <meta name="description" content="Turnos Tattoo es la plataforma ideal para tatuadores. Gestiona tus turnos, exhibe tu portafolio y optimiza tu negocio de forma fácil y profesional." />
        <meta property="og:title" content="Turnos Tattoo - Software de Gestión para Tatuadores" />
        <meta property="og:description" content="Lleva tu estudio de tatuajes al siguiente nivel con Turnos Tattoo." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=1200&h=630" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23054d44%22/><text y=%2250%22 x=%2250%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2260%22 font-family=%22Montserrat, sans-serif%22 fill=%22%23ffffff%22 font-weight=%22bold%22>TT</text></svg>" />
        <link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%23054d44%22/><text y=%2250%22 x=%2250%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 font-size=%2260%22 font-family=%22Montserrat, sans-serif%22 fill=%22%23ffffff%22 font-weight=%22bold%22>TT</text></svg>" />
      </Helmet>`;

content = content.replace(regex, newHelmet);

fs.writeFileSync('src/components/Landing.tsx', content);
console.log("Patched Landing.tsx successfully!");
