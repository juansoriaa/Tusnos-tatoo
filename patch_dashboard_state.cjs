const fs = require('fs');
let content = fs.readFileSync('src/components/DemoDashboard.tsx', 'utf8');

const metricsState = `
    const [metrics, setMetrics] = useState({
        views: 12400,
        photoClicks: 1200,
        whatsappClicks: 856,
        agendaClicks: 48
    });
    
    useEffect(() => {
        const loadMetrics = () => {
            try {
                const stored = localStorage.getItem('demoMetricsData');
                if (stored) {
                    setMetrics(JSON.parse(stored));
                }
            } catch (e) {}
        };
        loadMetrics();
        window.addEventListener('demoMetricsUpdated', loadMetrics);
        return () => window.removeEventListener('demoMetricsUpdated', loadMetrics);
    }, []);

    const baseMetrics = {
        views: 11025,
        photoClicks: 1140,
        whatsappClicks: 790,
        agendaClicks: 40
    };

    const calcIncrease = (current, base) => {
        if (current <= base) return '0.0%';
        return '+' + (((current - base) / base) * 100).toFixed(1) + '%';
    };
    
    const formatNumber = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num.toString();
    };
`;

content = content.replace(/(const \[bannerUrl, setBannerUrl\] = useState\(defaultBanner\);)/, "$1\n" + metricsState);
fs.writeFileSync('src/components/DemoDashboard.tsx', content);
