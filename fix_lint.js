import fs from 'fs';
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

// Fix theme typing issue
code = code.replace(
  /if \(parsed\.theme && !docSnap\.metadata\?\.fromCache && data\.theme !== parsed\.theme\)/,
  'if (parsed.theme && !docSnap.metadata?.fromCache && (data as any).theme !== parsed.theme)'
);

// Fix TS2322 for fallback photos typing
code = code.replace(
  /let finalPhotos = snap\.docs\.map\(d => \{/g,
  'let finalPhotos: any[] = snap.docs.map(d => {'
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
