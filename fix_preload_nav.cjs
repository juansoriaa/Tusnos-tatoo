const fs = require('fs');

let content = fs.readFileSync('src/components/Preload.tsx', 'utf8');

const target = `    const navigateToProfile = () => {
      if (isMounted && minTimePassed && dataLoaded) {
        navigate('/demo/profile' + (id ? '/' + id : ''), { replace: true });
      }
    };`;

const replacement = `    const navigateToProfile = () => {
      if (isMounted && minTimePassed && dataLoaded) {
        sessionStorage.setItem('preloaded_' + (id || 'demo'), 'true');
        navigate(id ? '/artist/' + id : '/demo/profile', { replace: true });
      }
    };`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/Preload.tsx', content);
