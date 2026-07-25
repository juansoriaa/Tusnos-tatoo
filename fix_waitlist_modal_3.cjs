const fs = require('fs');
let content = fs.readFileSync('src/components/DemoWaitlist.tsx', 'utf8');

const oldModalContent = `                            {workModalData?.title && workModalData?.title !== 'Imagen adjuntada' && (
                                <h3 className="font-headline-md text-silver-text mb-0">
                                    {workModalData.title}
                                </h3>
                            )}`;

const newModalContent = `                            {workModalData?.tags?.includes('Refe. del portafolio') && workModalData?.title && workModalData?.title !== 'Imagen adjuntada' && (
                                <h3 className="font-headline-md text-silver-text mb-0">
                                    {workModalData.title}
                                </h3>
                            )}`;
                    
content = content.replace(oldModalContent, newModalContent);
fs.writeFileSync('src/components/DemoWaitlist.tsx', content);
