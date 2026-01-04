// Minimal Google Analytics 4 Implementation
// Replaces the heavy Firebase SDK with a lightweight gtag.js wrapper

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const initAnalytics = () => {
  const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;

  if (!measurementId) {
    console.warn('Analytics: No Measurement ID found');
    return;
  }

  // Prevent double loading
  if (document.getElementById('ga-script')) return;

  // Inject the script tag
  const script = document.createElement('script');
  script.id = 'ga-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false
  });
};

export const logPageView = (path: string) => {
  if (window.gtag) {
    const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
    window.gtag('config', measurementId, {
      page_path: path,
    });
  }
};

export const logEvent = (eventName: string, params?: Record<string, any>) => {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
};
