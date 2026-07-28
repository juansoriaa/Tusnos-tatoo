const fs = require('fs');
let code = fs.readFileSync('src/components/Landing.tsx', 'utf8');

code = code.replace(
    /useEffect\(\(\) => \{\s*window\.scrollTo\(0, 0\);/,
    `useEffect(() => {
    window.scrollTo(0, 0);
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('login') === 'true') {
        setIsRegister(false);
        setShowLoginModal(true);
    }`
);

fs.writeFileSync('src/components/Landing.tsx', code);
