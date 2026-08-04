import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const earlyReturn = `    if (isProfileLoading) {
    return (
      <div className="bg-background min-h-screen flex flex-col animate-pulse">
        <div className="h-[30vh] md:h-[40vh] bg-surface-variant w-full" />
        <div className="max-w-screen-xl mx-auto px-4 w-full -mt-20 md:-mt-24 flex flex-col items-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-surface-container border-4 border-background mb-4" />
            <div className="h-8 bg-surface-container rounded w-64 mb-4" />
            <div className="flex gap-4 mb-4">
                <div className="h-6 bg-surface-container rounded w-24" />
                <div className="h-6 bg-surface-container rounded w-24" />
            </div>
            <div className="h-16 bg-surface-container rounded w-full max-w-2xl mb-8" />
            <div className="h-12 bg-surface-container rounded w-48 mb-12" />
            
            <div className="grid grid-cols-3 gap-2 w-full">
                <div className="aspect-square bg-surface-container" />
                <div className="aspect-square bg-surface-container" />
                <div className="aspect-square bg-surface-container" />
                <div className="aspect-square bg-surface-container hidden md:block" />
                <div className="aspect-square bg-surface-container hidden md:block" />
                <div className="aspect-square bg-surface-container hidden md:block" />
            </div>
        </div>
      </div>
    );
  }`;

code = code.replace(earlyReturn, '');
fs.writeFileSync('src/components/ArtistProfile.tsx', code);
