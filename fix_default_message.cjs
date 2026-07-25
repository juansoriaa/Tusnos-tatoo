const fs = require('fs');
let content = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

const oldDefaultMessage = `        { 
            id: 1,
            name: 'Alex M.', 
            time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
            title: 'Consulta de Cover-up', 
            text: 'Tengo un tatuaje antiguo en mi antebrazo que quiero cubrir con algo botánico. Específicamente buscando peonías y helechos en blackwork. ¿Es posible? Tengo imágenes de referencia.', 
            hasImage: true, 
            type: 'Nueva solicitud', 
            typeClass: 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-border-muted whitespace-nowrap rounded',
            read: false,
            tags: ['Consulta', 'Refe. del usuario']
        },`;

const newDefaultMessage = `        { 
            id: 1,
            name: 'Alex M.', 
            time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), 
            title: 'Consulta de Cover-up', 
            text: 'Tengo un tatuaje antiguo en mi antebrazo que quiero cubrir con algo botánico. Específicamente buscando peonías y helechos en blackwork. ¿Es posible? Tengo imágenes de referencia.', 
            hasImage: true,
            referenceTitle: 'Referencia subida por el cliente',
            type: 'Nueva solicitud', 
            typeClass: 'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-surface-variant text-on-surface-variant border border-border-muted whitespace-nowrap rounded',
            read: false,
            tags: ['Consulta', 'Refe. del usuario']
        },`;

content = content.replace(oldDefaultMessage, newDefaultMessage);
fs.writeFileSync('src/components/DemoWaitlist.tsx', content);
