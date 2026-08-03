const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf-8');

const oldFallbackData = `            setInitialDataStr(JSON.stringify({
                name: 'Victor Ink',
                bio: 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                specialty1: 'Realismo',
                specialty2: 'Black & Grey',
                specialty3: '',
                isAvailable: true,
                whatsapp: '',
                instagram: '',
                facebook: '',
                tiktok: '',
                avatarUrl: defaultAvatar,
                bannerUrl: defaultBanner,
                hasPhysicalStudio: true,
                studioName: '',
                studioDescription: '',
                studioAddress: '',
                studioHours: '',
                mapLink: '',
                faqs: defaultFaqs
            }));`;

const newFallbackData = `            setInitialDataStr(JSON.stringify({
                name: 'Victor Ink',
                bio: 'Especialista en realismo con 10 años de trayectoria. Mi enfoque se centra en crear piezas únicas que cuenten una historia a través del contraste y los detalles minuciosos del estilo black & grey. Cada tatuaje es una obra de arte diseñada específicamente para la anatomía y visión del cliente.',
                specialty1: 'Realismo',
                specialty2: 'Black & Grey',
                specialty3: '',
                isAvailable: true,
                whatsapp: '',
                loginEmail: '',
                customPassword: '',
                instagram: '',
                facebook: '',
                tiktok: '',
                avatarUrl: defaultAvatar,
                bannerUrl: defaultBanner,
                hasPhysicalStudio: true,
                studioName: '',
                studioDescription: '',
                studioAddress: '',
                studioHours: '',
                mapLink: '',
                faqs: defaultFaqs
            }));`;

content = content.replace(oldFallbackData, newFallbackData);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
console.log("Patched fallback order successfully!");
