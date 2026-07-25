const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdmin.tsx', 'utf8');

const stateInjection = `  const [showAllRenewals, setShowAllRenewals] = useState(false);
  const [globalConfig, setGlobalConfig] = useState({
    monthlySubscriptionPrice: 149,
    expenses: [] as { id: string, name: string, price: number, type: 'monthly' | 'annual' }[]
  });
  const [newExpense, setNewExpense] = useState({ name: '', price: 0, type: 'monthly' as 'monthly' | 'annual' });
  const [isSavingConfig, setIsSavingConfig] = useState(false);
`;
content = content.replace('  const [showAllRenewals, setShowAllRenewals] = useState(false);', stateInjection);

const fetchInjection = `    const fetchConfig = async () => {
      try {
        const configDoc = await getDoc(doc(db, 'config', 'main'));
        if (configDoc.exists()) {
          setGlobalConfig(configDoc.data() as any);
        }
      } catch (error) {
        console.error("Error fetching config", error);
      }
    };
    fetchConfig();
    fetchMetrics();
`;
content = content.replace('    fetchMetrics();', fetchInjection);

fs.writeFileSync('src/components/SuperAdmin.tsx', content);
