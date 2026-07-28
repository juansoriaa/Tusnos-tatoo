const fs = require('fs');
const code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

const regex = /\{showRankingModal && \([\s\S]*?\}\)[\s\S]*?\{showRankingModal && \(/;

if (regex.test(code)) {
    // Find the second `{showRankingModal && (` and remove the duplicate block
    const firstIndex = code.indexOf('{showRankingModal && (');
    const secondIndex = code.indexOf('{showRankingModal && (', firstIndex + 1);
    
    if (secondIndex !== -1) {
        // the block ends with `)}`
        // find the end of the first block
        const firstBlockEnd = code.indexOf(')}', firstIndex);
        
        // Let's just do a simpler replacement of the whole second block manually
        // we can slice the file.
        // Wait, the structure is:
        // {showRankingModal && ( ... )}
        // {showRankingModal && ( ... )}
        // We can just keep the text before the second one and after the second one.
        
        const textBefore = code.slice(0, secondIndex);
        
        // Find the closing of the second block: `)}\n            </div>`
        const closingDiv = code.indexOf('</div>\n        </DemoLayout>', secondIndex);
        
        if (closingDiv !== -1) {
            fs.writeFileSync('src/components/DemoMetrics.tsx', textBefore + code.slice(closingDiv));
        }
    }
}

