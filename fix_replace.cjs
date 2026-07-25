const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const openModal = (index: number) => {
    const photoId = visibleTattoos[index]?.id;
    if (photoId) {
      setSearchParams({ photo: photoId }, { replace: true });
    } else {
      setActiveTattooIndex(index);
      setModalOpen(true);
      trackMetric('photoClicks');
      document.body.classList.add('overflow-hidden');
    }
  };`;

const replacement = `  const openModal = (index: number) => {
    const photoId = visibleTattoos[index]?.id;
    if (photoId) {
      setSearchParams({ photo: photoId }); // Pushes to history so back button closes modal
    } else {
      setActiveTattooIndex(index);
      setModalOpen(true);
      trackMetric('photoClicks');
      document.body.classList.add('overflow-hidden');
    }
  };`;

content = content.replace(target, replacement);

const target2 = `  const closeModal = () => {
    if (searchParams.get('photo')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('photo');
      setSearchParams(newParams); // Push or replace? Usually if back button closes, clicking close should just go back
    } else {
      setModalOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  };`;

// Let's just do a string replacement for the exact close modal
content = content.replace(
  `  const closeModal = () => {
    if (searchParams.get('photo')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('photo');
      setSearchParams(newParams, { replace: true });
    } else {
      setModalOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  };`,
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
  };`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
