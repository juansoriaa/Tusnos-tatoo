const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const target = `  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (email === 'demo' && password === 'demo') {
      setShowLoginModal(false);
      navigate('/demo/dashboard');
      return;
    }

    if (email === 'AdminPass2026' && password === '230517') {
      setShowLoginModal(false);
      navigate('/superadmin');
      return;
    }`;

const newTarget = `  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    const trimEmail = email.trim().toLowerCase();
    const trimPass = password.trim();

    if (trimEmail === 'demo' && trimPass === 'demo') {
      setShowLoginModal(false);
      navigate('/demo/dashboard');
      return;
    }

    if (trimEmail === 'adminpass2026' && trimPass === '230517') {
      setShowLoginModal(false);
      navigate('/superadmin');
      return;
    }`;

if (content.includes("email === 'demo'")) {
    content = content.replace(target, newTarget);
    fs.writeFileSync('src/components/Landing.tsx', content);
}
