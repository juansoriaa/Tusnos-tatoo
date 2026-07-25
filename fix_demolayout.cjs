const fs = require('fs');
let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

// Change scrollbar
content = content.replace('width: 8px;', 'width: 4px;');
content = content.replace('background: #353434;', 'background: #054d44; border-radius: 4px;');

// Change text
content = content.replace('Artist Profile', 'Perfil del Artista');
content = content.replace('New Appointment', 'Nuevo Turno');
content = content.replace('<span className="font-label-md">Dashboard</span>', '<span className="font-label-md">Panel</span>');
content = content.replace('<span className="font-label-md">Portfolio</span>', '<span className="font-label-md">Portafolio</span>');
content = content.replace('<span className="font-label-md">Schedule</span>', '<span className="font-label-md">Agenda</span>');
content = content.replace('<span className="font-label-md">Metrics</span>', '<span className="font-label-md">Métricas</span>');
content = content.replace('<span className="font-label-md">Settings</span>', '<span className="font-label-md">Configuración</span>');
content = content.replace('<span className="font-label-md">Support</span>', '<span className="font-label-md">Soporte</span>');
content = content.replace('<span className="font-label-md">Logout</span>', '<span className="font-label-md">Cerrar sesión</span>');

// Mobile Bottom Nav
content = content.replace('<span className="font-label-sm text-[10px]">Home</span>', '<span className="font-label-sm text-[10px]">Inicio</span>');
content = content.replace('<span className="font-label-sm text-[10px]">Portfolio</span>', '<span className="font-label-sm text-[10px]">Portafolio</span>');
content = content.replace('<span className="font-label-sm text-[10px]">Schedule</span>', '<span className="font-label-sm text-[10px]">Agenda</span>');
content = content.replace('<span className="font-label-sm text-[10px]">Metrics</span>', '<span className="font-label-sm text-[10px]">Métricas</span>');

fs.writeFileSync('src/components/DemoLayout.tsx', content);
