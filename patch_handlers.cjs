const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

content = content.replace(
  "setUsers(users.map(u => u.uid === userId ? {...u, subscriptionStatus: 'monthly', subscriptionEndsAt: endsDate} : u));",
  "setUsers(users.map(u => u.uid === userId ? {...u, subscriptionStatus: 'monthly', subscriptionEndsAt: endsDate} : u));\n      if (detailsModalUser?.uid === userId) setDetailsModalUser({...detailsModalUser, subscriptionStatus: 'monthly', subscriptionEndsAt: endsDate});"
);

content = content.replace(
  "setUsers(users.map(u => u.uid === userId ? {...u, subscriptionEndsAt: endsDate} : u));",
  "setUsers(users.map(u => u.uid === userId ? {...u, subscriptionEndsAt: endsDate} : u));\n      if (detailsModalUser?.uid === userId) setDetailsModalUser({...detailsModalUser, subscriptionEndsAt: endsDate});"
);

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
