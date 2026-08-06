import fs from 'fs';
let code = fs.readFileSync('src/components/Landing.tsx', 'utf8');

const target1 = `  const [activeSlide, setActiveSlide] = useState(0);
  const [directoryWorks, setDirectoryWorks] = useState<any[]>([]);`;

const rep1 = `  const [activeSlide, setActiveSlide] = useState(0);
  const [directoryWorks, setDirectoryWorks] = useState<any[]>([]);
  const [isLoadingDirectoryWorks, setIsLoadingDirectoryWorks] = useState(true);`;

const target2 = `    const fetchDirectoryWorks = async () => {
      try {
        let snapshot;`;

const rep2 = `    const fetchDirectoryWorks = async () => {
      setIsLoadingDirectoryWorks(true);
      try {
        let snapshot;`;

const target3 = `              setDirectoryWorks(combinedWorks);
          }
        }
      } catch (err) {
        console.error("Error fetching directory works:", err);
      }
    };
    fetchDirectoryWorks();`;

const rep3 = `              setDirectoryWorks(combinedWorks);
          }
        }
      } catch (err) {
        console.error("Error fetching directory works:", err);
      } finally {
        setIsLoadingDirectoryWorks(false);
      }
    };
    fetchDirectoryWorks();`;

const target4 = `            {/* Mobile Carousel & Desktop Grid */}
            <div className="block md:hidden relative w-full overflow-hidden rounded-2xl neon-border h-[450px]">
                <div className="flex w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: \`translateX(-\${activeSlide * 100}%)\` }}>
                   {displayWorks.map((photo, idx) => (`;

const rep4 = `            {/* Mobile Carousel & Desktop Grid */}
            {isLoadingDirectoryWorks ? (
              <div className="w-full flex items-center justify-center h-[450px] md:h-[400px] bg-surface-container rounded-2xl border border-outline-variant/20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
            <>
            <div className="block md:hidden relative w-full overflow-hidden rounded-2xl neon-border h-[450px]">
                <div className="flex w-full h-full transition-transform duration-500 ease-in-out" style={{ transform: \`translateX(-\${activeSlide * 100}%)\` }}>
                   {displayWorks.map((photo, idx) => (`;

const target5 = `                  </div>
              ))}
            </div>
          </div>
        </section>`;

const rep5 = `                  </div>
              ))}
            </div>
            </>
            )}
          </div>
        </section>`;


code = code.replace(target1, rep1).replace(target2, rep2).replace(target3, rep3).replace(target4, rep4).replace(target5, rep5);
fs.writeFileSync('src/components/Landing.tsx', code);
