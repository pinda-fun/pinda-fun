import { useEffect, useState } from 'react';
import ReactGA from 'react-ga/core';
import { useLocation } from 'react-router-dom';
import getClientId from 'utils/getClientId';

const TRACKING_ID = 'UA-151199787-1';

const usePageTracking = () => {
  const [initialised, setInitialised] = useState(false);
  useEffect(() => {
    if (window.location.origin.includes('pinda.fun')) {
      ReactGA.initialize(TRACKING_ID, { gaOptions: { clientId: getClientId() } });
      setInitialised(true);
    }
  }, []);

  const location = useLocation();
  useEffect(() => {
    if (initialised) {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname);
    }
  }, [initialised, location]);
};

export default usePageTracking;
