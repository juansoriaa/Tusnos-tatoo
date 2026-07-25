const fs = require('fs');

let content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

const target = `                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: artistData?.displayName || 'Perfil de Artista',
                        url: window.location.href
                      });
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      alert('URL copiada al portapapeles');
                    }
                  } catch (err) {
                    console.error('Error al compartir', err);
                  }`;

const replacement = `                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: artistData?.displayName || 'Perfil de Artista',
                        url: window.location.href
                      });
                    } else {
                      await navigator.clipboard.writeText(window.location.href);
                      alert('URL copiada al portapapeles');
                    }
                  } catch (err: any) {
                    if (err.name !== 'AbortError' && !err.message?.includes('canceled') && err.name !== 'NotAllowedError') {
                      try {
                        await navigator.clipboard.writeText(window.location.href);
                        alert('URL copiada al portapapeles');
                      } catch (fallbackErr) {
                         console.log('Compartir cancelado o no disponible.');
                      }
                    }
                  }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/components/ArtistProfile.tsx', content);

