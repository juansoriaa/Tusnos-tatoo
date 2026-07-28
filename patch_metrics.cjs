const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

// 1. Remove mocked metrics for @demo
code = code.replace(
    /if \(data\.userTag === '@demo'.*?\{.*?parsed = \{.*?views: 12400.*?photoClicks: 1200.*?whatsappClicks: 856.*?agendaClicks: 48.*?};.*?\} else \{/s,
    'if (true) {'
);

// 2. Remove fallback photo appending
code = code.replace(
    /if \(isDemoUser\) \{\s*const deletedFallbacks = JSON\.parse\(localStorage\.getItem\('deletedFallbacks'\) \|\| '\[\]'\);\s*const filteredFallback = fallback\.filter\(f => !dbPhotos\.some\(p => p\.originalFallbackId === f\.id\) && !deletedFallbacks\.includes\(f\.id\)\);\s*finalPhotos = \[\.\.\.finalPhotos, \.\.\.filteredFallback\];\s*\}/s,
    ''
);

fs.writeFileSync('src/components/DemoMetrics.tsx', code);
