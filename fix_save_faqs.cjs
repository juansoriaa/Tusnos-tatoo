const fs = require('fs');

let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const saveFaqsFn = `
    const handleSaveFaqs = () => {
        try {
            const saved = localStorage.getItem('demoArtistData');
            let data = saved ? JSON.parse(saved) : {};
            data.faqs = faqs;
            localStorage.setItem('demoArtistData', JSON.stringify(data));
            window.dispatchEvent(new CustomEvent('profileDataChanged'));
            alert("FAQs guardadas exitosamente!");
        } catch(err) {
            console.error(err);
        }
    };
`;

content = content.replace(/    return \(\n        <DemoLayout/, saveFaqsFn + "\n    return (\n        <DemoLayout");

fs.writeFileSync('src/components/DemoDashboard.tsx', content);
