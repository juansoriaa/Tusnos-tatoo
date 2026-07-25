const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

// The file currently ends with:
//             </div>
//         </div>
//     );
// }        </DemoLayout>
//     );
// }

// Let's just find the last </section>                </div>            </main> 
// Wait, I will just find `</main>` and remove everything after it, then append `</DemoLayout>);}`

let mainEnd = content.indexOf('</main>');
if (mainEnd > -1) {
    content = content.substring(0, mainEnd) + '</DemoLayout>\n    );\n}\n';
    // wait, `mainContent` extracted the `</main>` ? No, content.substring(start, end) excludes endMarker.
    // Let's just do a regex replace to clean the end.
}

// Actually, let's just do it with standard text replacement from the original file.
