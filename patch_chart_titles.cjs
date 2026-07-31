const fs = require('fs');
let content = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf-8');

const oldTitles = `    const chartTitles = {
        views: 'Visitas Totales',
        photoClicks: 'Clicks en Fotos',
        whatsappClicks: 'Clicks en WhatsApp'
    };`;

const newTitles = `    const chartTitles = {
        views: 'Visitas Totales',
        photoClicks: 'Clicks en Fotos',
        whatsappClicks: 'Clicks en WhatsApp',
        agendaClicks: 'Clicks en Agenda'
    };`;

content = content.replace(oldTitles, newTitles);
fs.writeFileSync('src/components/DemoMetrics.tsx', content);
