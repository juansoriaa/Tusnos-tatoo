const fs = require('fs');
let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const replacements = [
  {
    find: 'categories: ["Realismo", "Blackwork"]\n    },',
    replace: 'categories: ["Realismo", "Blackwork"],\n      hours: 15,\n      sessions: 3,\n      size: "Media manga"\n    },',
    fallbackId: '"fallback_4"'
  },
  {
    find: 'categories: ["Blackwork", "Realismo"]\n    },',
    replace: 'categories: ["Blackwork", "Realismo"],\n      hours: 8,\n      sessions: 2,\n      size: "15x15 cm"\n    },',
    fallbackId: '"fallback_5"'
  },
  {
    find: 'categories: ["Minimalista"]\n    },',
    replace: 'categories: ["Minimalista"],\n      hours: 2,\n      sessions: 1,\n      size: "5x5 cm"\n    },',
    fallbackId: '"fallback_6"'
  },
  {
    find: 'categories: ["Realismo", "Tradicional"]\n    },',
    replace: 'categories: ["Realismo", "Tradicional"],\n      hours: 10,\n      sessions: 2,\n      size: "20x20 cm"\n    },',
    fallbackId: '"fallback_7"'
  },
  {
    find: 'categories: ["Realismo", "Minimalista"]\n    },',
    replace: 'categories: ["Realismo", "Minimalista"],\n      hours: 4,\n      sessions: 1,\n      size: "8x8 cm"\n    },',
    fallbackId: '"fallback_8"'
  },
  {
    find: 'categories: ["Blackwork", "Minimalista"]\n    },',
    replace: 'categories: ["Blackwork", "Minimalista"],\n      hours: 6,\n      sessions: 1,\n      size: "10x20 cm"\n    },',
    fallbackId: '"fallback_9"'
  },
  {
    find: 'categories: ["Minimalista"]\n    },',
    replace: 'categories: ["Minimalista"],\n      hours: 1,\n      sessions: 1,\n      size: "3x10 cm"\n    },',
    fallbackId: '"fallback_10"'
  },
  {
    find: 'categories: ["Blackwork", "Minimalista"]\n    },',
    replace: 'categories: ["Blackwork", "Minimalista"],\n      hours: 5,\n      sessions: 1,\n      size: "12x12 cm"\n    },',
    fallbackId: '"fallback_11"'
  },
  {
    find: 'categories: ["Tradicional"]\n    }',
    replace: 'categories: ["Tradicional"],\n      hours: 7,\n      sessions: 2,\n      size: "15x10 cm"\n    }',
    fallbackId: '"fallback_12"'
  }
];

let currentIndex = 0;
for (const r of replacements) {
    const nextFallbackIdx = content.indexOf(r.fallbackId);
    if (nextFallbackIdx === -1) continue;
    
    // find the string r.find after nextFallbackIdx
    const findIdx = content.indexOf(r.find, nextFallbackIdx);
    if (findIdx !== -1) {
        content = content.substring(0, findIdx) + r.replace + content.substring(findIdx + r.find.length);
    }
}

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
