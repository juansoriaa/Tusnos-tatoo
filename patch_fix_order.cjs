const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf-8');

// The currentData has: whatsapp, instagram, loginEmail, customPassword, facebook
// Let's modify currentData to have the same order as initialDataStr

const oldCurrentData = `    const currentData = {
        name, bio, specialty1, specialty2, specialty3, isAvailable,
        whatsapp, instagram, loginEmail, customPassword, facebook, tiktok, avatarUrl, bannerUrl,
        hasPhysicalStudio, studioName, studioDescription, studioAddress, studioHours, mapLink, faqs
    };`;

const newCurrentData = `    const currentData = {
        name, bio, specialty1, specialty2, specialty3, isAvailable,
        whatsapp, loginEmail, customPassword, instagram, facebook, tiktok, avatarUrl, bannerUrl,
        hasPhysicalStudio, studioName, studioDescription, studioAddress, studioHours, mapLink, faqs
    };`;

content = content.replace(oldCurrentData, newCurrentData);

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
console.log("Patched order successfully!");
