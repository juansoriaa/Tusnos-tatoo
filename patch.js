const fs = require('fs');
let renewals = fs.readFileSync('renewals.txt', 'utf8');

renewals = renewals.replace('}).map((user) => {', '}).slice(0, showAllRenewals ? undefined : 7).map((user) => {');

const buttonLogic = `
                {users.filter(u => {
                   if (renewalFilter === 'all') return true;
                   if (renewalFilter === 'trial') return u.subscriptionStatus === 'trial';
                   if (renewalFilter === 'monthly') return u.subscriptionStatus === 'monthly';
                   if (renewalFilter === 'partner') return u.subscriptionStatus === 'partner';
                   if (renewalFilter === 'expiring') {
                       if (u.subscriptionStatus === 'partner') return false;
                       let daysLeft = 0;
                       if (u.subscriptionEndsAt && u.subscriptionEndsAt.toDate) {
                           const diffTime = u.subscriptionEndsAt.toDate().getTime() - new Date().getTime();
                           daysLeft = diffTime < 0 ? -Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24)) : Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       }
                       return daysLeft <= 3;
                   }
                   return true;
                }).length > 7 && (
                  <button onClick={() => setShowAllRenewals(!showAllRenewals)} className="text-primary hover:text-primary-fixed transition-colors text-sm font-bold text-center mt-2 py-2 w-full">
                    {showAllRenewals ? 'Ver menos' : 'Ver más'}
                  </button>
                )}
`;

renewals = renewals.replace('                )}', '                )}\n' + buttonLogic);
fs.writeFileSync('renewals.txt', renewals);
