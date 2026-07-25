const fs = require('fs');
const content = fs.readFileSync('src/components/ArtistProfile.tsx', 'utf8');
if (!content.includes('trackMetric')) {
    const trackCode = `
  const trackMetric = (metricKey: 'views' | 'photoClicks' | 'whatsappClicks' | 'agendaClicks') => {
      try {
          const metricsStr = localStorage.getItem('demoMetricsData');
          const metrics = metricsStr ? JSON.parse(metricsStr) : {
              views: 12400,
              photoClicks: 1200,
              whatsappClicks: 856,
              agendaClicks: 48
          };
          metrics[metricKey] = (metrics[metricKey] || 0) + 1;
          localStorage.setItem('demoMetricsData', JSON.stringify(metrics));
          window.dispatchEvent(new CustomEvent('demoMetricsUpdated'));
      } catch(e) {}
  };

  useEffect(() => {
      if (!sessionStorage.getItem('profileViewed')) {
          sessionStorage.setItem('profileViewed', 'true');
          trackMetric('views');
      }
  }, []);
`;
    // Insert after const [modalOpen, setModalOpen] = useState(false);
    const updatedContent = content.replace(/(const \[modalOpen, setModalOpen\] = useState\(false\);)/, `$1\n${trackCode}`);
    fs.writeFileSync('src/components/ArtistProfile.tsx', updatedContent);
}
