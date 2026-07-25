import re

with open('src/components/ArtistProfile.tsx', 'r') as f:
    content = f.read()

target = r"const currentUrl = new URL\(window\.location\.href\);\s*currentUrl\.searchParams\.set\('photo', photoId\);\s*const message = `Hola \$\{artistData\?\.displayName \|\| 'artista'\}, vengo de tu página web y me encantó este tatuaje\. Me gustaría hacerme algo similar o saber más al respecto:\\n\\n\$\{currentUrl\.toString\(\)\}`;?"
replacement = """const photoUrl = visibleTattoos[activeTattooIndex].src;
                                   const profileUrl = window.location.origin + window.location.pathname;
                                   const message = `Hola ${artistData?.displayName || 'artista'}, vengo de tu página web y me encantó este tatuaje. Me gustaría hacerme algo similar o saber más al respecto:\\n\\nReferencia: ${photoUrl}\\n\\nPerfil: ${profileUrl}`;"""

content = re.sub(target, replacement, content)

with open('src/components/ArtistProfile.tsx', 'w') as f:
    f.write(content)

