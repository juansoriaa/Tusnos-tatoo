import fs from 'fs';

let code = fs.readFileSync('src/components/DemoLayout.tsx', 'utf8');

// The user might want to open the profile in a new tab. Let's see if we should.
// Actually the user said: "asegúrate que la URL de cada profile y dasboard estén bien"

code = code.replace(
  /onClick=\{\(\) => handleNav\(currentUserTag \? '\/' \+ \(currentUserTag\.startsWith\('@'\) \? currentUserTag : '@' \+ currentUserTag\) : \(authUid \? '\/' \+ authUid : '\/@victor_ink'\)\)\}/g,
  "onClick={() => window.open(currentUserTag ? '/' + (currentUserTag.startsWith('@') ? currentUserTag : '@' + currentUserTag) : (authUid ? '/' + authUid : '/@victor_ink'), '_blank')}"
);

fs.writeFileSync('src/components/DemoLayout.tsx', code);
