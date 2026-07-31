const fs = require('fs');
let content = fs.readFileSync('src/components/Landing.tsx', 'utf-8');

content = content.replace(
    "setLoginError('Credenciales incorrectas.');",
    "setLoginError('Usuario o contraseña incorrecta.');"
);

content = content.replace(
    "setLoginError('Usuario no encontrado. Solo un superadmin puede crear cuentas.');",
    "setLoginError('Usuario no encontrado.');"
);

fs.writeFileSync('src/components/Landing.tsx', content);
