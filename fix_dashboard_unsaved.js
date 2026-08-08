import fs from 'fs';
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const target1 = `    const currentData = {
        name, bio, specialty1, specialty2, specialty3, isAvailable,
        whatsapp, loginEmail, customPassword, instagram, facebook, tiktok, avatarUrl, bannerUrl,
        hasPhysicalStudio, studioName, studioDescription, studioAddress, studioHours, mapLink, faqs
    };`;
const rep1 = `    const currentData = {
        name, bio, specialty1, specialty2, specialty3, isAvailable,
        whatsapp, loginEmail, customPassword, instagram, facebook, tiktok, avatarUrl, bannerUrl,
        hasPhysicalStudio, studioName, studioDescription, studioAddress, studioHours, mapLink, faqs, theme
    };`;

code = code.replace(target1, rep1);

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
