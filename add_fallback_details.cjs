const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// replace some fallback categories with hours, sessions, size
content = content.replace(
  'categories: ["Realismo", "Blackwork"]\n    },',
  'categories: ["Realismo", "Blackwork"],\n      hours: 12,\n      sessions: 2,\n      size: "20x15 cm"\n    },'
);

content = content.replace(
  'categories: ["Minimalista"]\n    },',
  'categories: ["Minimalista"],\n      hours: 3,\n      sessions: 1,\n      size: "8x5 cm"\n    },'
);

content = content.replace(
  'categories: ["Blackwork", "Tradicional"]\n    },',
  'categories: ["Blackwork", "Tradicional"],\n      hours: 24,\n      sessions: 4,\n      size: "Espalda completa"\n    },'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', content);
