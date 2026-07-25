const fs = require('fs');

const files = [
    { name: 'src/components/DemoDashboard.tsx', original: 'Overview of your business, booking status, and artist profile.', new: 'Resumen de tu negocio, estado de turnos y perfil de artista.' },
    { name: 'src/components/DemoMetrics.tsx', original: 'Track your performance, view interactions, and analyze your engagement over time.', new: 'Rastrea tu rendimiento, visualiza interacciones y analiza el engagement.' },
    { name: 'src/components/DemoPortfolio.tsx', original: 'Curate your gallery. Manage categories, upload new pieces, and organize your public portfolio with surgical precision.', new: 'Gestiona tu galería. Maneja categorías, sube nuevas obras y organiza tu portafolio público.' },
    { name: 'src/components/DemoWaitlist.tsx', original: 'Manage your appointments, messages, and tattoo sessions effectively.', new: 'Gestiona tus turnos, mensajes y sesiones de tatuajes.' }
];

for (let file of files) {
    if (fs.existsSync(file.name)) {
        let content = fs.readFileSync(file.name, 'utf8');
        content = content.replace(file.original, file.new);
        fs.writeFileSync(file.name, content);
    }
}
