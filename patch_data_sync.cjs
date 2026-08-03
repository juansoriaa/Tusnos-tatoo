const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf-8');

// I will just make them sync up EXACTLY by doing this: 
// On initial load, after setting all the states, I will just build the initialData object EXACTLY the same way as currentData, by using a state for initialData object, and doing a deep compare, OR just stringify after all states are set!
// BUT React states are asynchronous. So we can't just read the state right after setting it.

// Let's just create a helper function that builds the data object, and we use it for both!
