const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

content = content.replace(
  `  const closeModal = () => {
    if (searchParams.get('photo')) {
      // If they click close, we can just navigate back one step in history, 
      // or just remove the param. Removing param with replace is safe.
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('photo');
      setSearchParams(newParams, { replace: false }); // Or navigate(-1) if we want to truly pop
    } else {
      setModalOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  };`,
  `  const closeModal = () => {
    if (searchParams.get('photo')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('photo');
      setSearchParams(newParams, { replace: true });
    } else {
      setModalOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  };`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
