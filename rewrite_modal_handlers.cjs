const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `  const openModal = (index: number) => {
    setActiveTattooIndex(index);
    setModalOpen(true);
    trackMetric('photoClicks');
    document.body.classList.add('overflow-hidden');
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.classList.remove('overflow-hidden');
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTattooIndex((prev) => (prev > 0 ? prev - 1 : visibleTattoos.length - 1));
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTattooIndex((prev) => (prev < visibleTattoos.length - 1 ? prev + 1 : 0));
  };`;

const replacement = `  const openModal = (index: number) => {
    const photoId = visibleTattoos[index]?.id;
    if (photoId) {
      setSearchParams({ photo: photoId }, { replace: true });
    } else {
      setActiveTattooIndex(index);
      setModalOpen(true);
      trackMetric('photoClicks');
      document.body.classList.add('overflow-hidden');
    }
  };

  const closeModal = () => {
    if (searchParams.get('photo')) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('photo');
      setSearchParams(newParams, { replace: true });
    } else {
      setModalOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = activeTattooIndex > 0 ? activeTattooIndex - 1 : visibleTattoos.length - 1;
    const photoId = visibleTattoos[newIndex]?.id;
    if (photoId) {
      setSearchParams({ photo: photoId }, { replace: true });
    } else {
      setActiveTattooIndex(newIndex);
    }
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newIndex = activeTattooIndex < visibleTattoos.length - 1 ? activeTattooIndex + 1 : 0;
    const photoId = visibleTattoos[newIndex]?.id;
    if (photoId) {
      setSearchParams({ photo: photoId }, { replace: true });
    } else {
      setActiveTattooIndex(newIndex);
    }
  };

  useEffect(() => {
    const photoId = searchParams.get('photo');
    if (photoId && allTattoos.length > 0) {
      const vIndex = visibleTattoos.findIndex(t => t.id === photoId);
      if (vIndex !== -1) {
        if (!modalOpen || activeTattooIndex !== vIndex) {
          setActiveTattooIndex(vIndex);
          if (!modalOpen) {
            setModalOpen(true);
            trackMetric('photoClicks');
            document.body.classList.add('overflow-hidden');
          }
        }
      } else {
        const aIndex = allTattoos.findIndex(t => t.id === photoId);
        if (aIndex !== -1) {
          if (activeCategory !== "All") setActiveCategory("All");
          if (!showMore) setShowMore(true);
        }
      }
    } else if (!photoId && modalOpen) {
      setModalOpen(false);
      document.body.classList.remove('overflow-hidden');
    }
  }, [searchParams, allTattoos, visibleTattoos, modalOpen, activeTattooIndex]);`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);
