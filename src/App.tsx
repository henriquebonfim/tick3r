import { initAnalytics, logPageView } from '@/lib/analytics';
import Index from '@/pages/Home';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    initAnalytics();
    logPageView(window.location.pathname);
  }, []);

  return <Index />;
};

export default App;
