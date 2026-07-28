const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// Replace md:text-left with md:text-center on line 882
code = code.replace(
    'text-center md:text-left flex flex-col items-center md:items-start w-full',
    'text-center md:text-center flex flex-col items-center md:items-center w-full'
);

// Tags container line 891
code = code.replace(
    'w-full px-10 md:px-0 ${visibleTattoos[activeTattooIndex].categories.length === 2 ? \'grid grid-cols-2 gap-6 md:flex md:flex-wrap md:items-center md:justify-center md:gap-4\' : \'flex flex-wrap items-center justify-center md:justify-center gap-3 md:gap-4\'}',
    'w-full px-10 md:px-0 flex flex-wrap items-center justify-center gap-3 md:gap-4'
);

// Tags item line 893
code = code.replace(
    'className={`flex ${arr.length === 2 ? (idx === 0 ? \'justify-end md:justify-center\' : \'justify-start\') : \'\'}`}',
    'className={`flex justify-center`}'
);

// Separator line 912-914
code = code.replace(
    'md:from-primary/10 md:to-primary',
    'md:from-transparent md:via-primary/60 md:to-primary'
);
code = code.replace(
    'md:bg-gradient-to-r md:from-primary md:to-transparent',
    'md:bg-gradient-to-l md:from-transparent md:via-primary/60 md:to-primary'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
