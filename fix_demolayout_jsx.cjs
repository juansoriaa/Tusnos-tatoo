const fs = require('fs');
let content = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

content = content.replace(/\$\{turnosLlenos \? 'mark_email_unread' : 'calendar_today'\}/g, "{turnosLlenos ? 'mark_email_unread' : 'calendar_today'}");
content = content.replace(/Agenda \$\{turnosLlenos \? '\(Nuevos\)' : ''\}/g, "Agenda {turnosLlenos ? '(Nuevos)' : ''}");

fs.writeFileSync('src/components/DemoLayout.tsx', content);
