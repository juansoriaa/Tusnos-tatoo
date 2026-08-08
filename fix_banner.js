import fs from 'fs';
let code = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

code = code.replace(
  "setBannerUrl(data.backgroundPhotos?.[0] || defaultBanner);",
  "setBannerUrl((data.backgroundPhotos && data.backgroundPhotos.length > 0 && data.backgroundPhotos[0]) ? data.backgroundPhotos[0] : defaultBanner);"
);

code = code.replace(
  "bannerUrl: (data.backgroundPhotos && data.backgroundPhotos.length > 0) ? data.backgroundPhotos[0] : defaultBanner,",
  "bannerUrl: (data.backgroundPhotos && data.backgroundPhotos.length > 0 && data.backgroundPhotos[0]) ? data.backgroundPhotos[0] : defaultBanner,"
);

fs.writeFileSync('src/components/DemoDashboard.tsx', code);
