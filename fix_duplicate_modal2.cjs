const fs = require('fs');
let code = fs.readFileSync('src/components/DemoMetrics.tsx', 'utf8');

const parts = code.split('{showRankingModal && (');
if (parts.length > 2) {
    // Keep first part, re-add first `{showRankingModal && (` and the second part up to the end of the block.
    // The second occurrence starts at parts[2]
    // The block ends with `)}`
    
    // We can just find the string that repeats and replace it with empty.
    // Actually, I can just find the index of the second `{showRankingModal && (`
    let first = code.indexOf('{showRankingModal && (');
    let second = code.indexOf('{showRankingModal && (', first + 1);
    let rest = code.slice(second);
    let endOfSecond = rest.indexOf(')}');
    
    // the end is probably followed by spaces and a newline
    code = code.slice(0, second) + rest.slice(endOfSecond + 2);
    fs.writeFileSync('src/components/DemoMetrics.tsx', code);
}
