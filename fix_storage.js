import fs from 'fs';
let code = fs.readFileSync('src/main.tsx', 'utf8');

const injection = `
const originalSetItem = Storage.prototype.setItem;
Storage.prototype.setItem = function(key, value) {
  try {
    originalSetItem.call(this, key, value);
  } catch (e) {
    console.warn('LocalStorage quota exceeded for key:', key);
  }
};
`;

if (!code.includes('originalSetItem')) {
  code = code.replace("import App from './App.tsx';", "import App from './App.tsx';\n" + injection);
  fs.writeFileSync('src/main.tsx', code);
}
