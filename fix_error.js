import fs from 'fs';
let code = fs.readFileSync('src/main.tsx', 'utf8');
code = code.replace("originalConsoleError(...args);", "originalConsoleError('Caught by interceptor:', ...args);");
code = `
window.onerror = function(message, source, lineno, colno, error) {
    console.error('GLOBAL ERROR:', message, source, lineno, colno, error);
};
window.addEventListener('unhandledrejection', function(event) {
    console.error('UNHANDLED PROMISE:', event.reason);
});
` + code;
fs.writeFileSync('src/main.tsx', code);
