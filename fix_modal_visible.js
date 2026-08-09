import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// Modal functions & hooks
code = code.replace(/visibleTattoos\[index\]\?\.id/g, 'filteredTattoos[index]?.id');
code = code.replace(/visibleTattoos\.length - 1/g, 'filteredTattoos.length - 1');
code = code.replace(/visibleTattoos\[newIndex\]\?\.id/g, 'filteredTattoos[newIndex]?.id');
code = code.replace(/visibleTattoos\.findIndex/g, 'filteredTattoos.findIndex');
code = code.replace(/visibleTattoos, modalOpen/g, 'filteredTattoos, modalOpen');
code = code.replace(/activeTattooIndex, visibleTattoos/g, 'activeTattooIndex, filteredTattoos');
code = code.replace(/visibleTattoos\[nextIndex\]/g, 'filteredTattoos[nextIndex]');
code = code.replace(/visibleTattoos\[prevIndex\]/g, 'filteredTattoos[prevIndex]');

// Modal JSX
code = code.replace(/modalOpen && visibleTattoos\.length > 0/g, 'modalOpen && filteredTattoos.length > 0');
code = code.replace(/visibleTattoos\[activeTattooIndex\]/g, 'filteredTattoos[activeTattooIndex]');

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
