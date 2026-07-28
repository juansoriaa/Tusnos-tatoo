const fs = require('fs');
let code = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');

code = code.replace(
    /const trackMetric = async \(metricKey: 'views' \| 'photoClicks' \| 'whatsappClicks' \| 'agendaClicks'\) => \{/,
    "const trackMetric = async (metricKey: 'views' | 'photoClicks' | 'whatsappClicks' | 'agendaClicks', photoId?: string) => {"
);

code = code.replace(
    /window\.dispatchEvent\(new CustomEvent\('demoMetricsUpdated'\)\);\n\s*\} else \{/s,
    `window.dispatchEvent(new CustomEvent('demoMetricsUpdated'));
              if (photoId) {
                  try {
                      await updateDoc(doc(db, 'photos', photoId), { clicks: increment(1) });
                  } catch (e) { console.error("Error updating photo clicks", e); }
              }
          } else {`
);

code = code.replace(
    /window\.dispatchEvent\(new CustomEvent\('demoMetricsUpdated'\)\);\n\s*\}\n\s*\}\n\s*\} catch\(e\) \{\}\n\s*\};/s,
    `window.dispatchEvent(new CustomEvent('demoMetricsUpdated'));
                  if (photoId) {
                      try {
                          await updateDoc(doc(db, 'photos', photoId), { clicks: increment(1) });
                      } catch (e) { console.error("Error updating photo clicks", e); }
                  }
              }
          }
      } catch(e) {}
  };`
);

fs.writeFileSync('src/components/ArtistProfile.tsx', code);
