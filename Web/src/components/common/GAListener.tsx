import { RouteComponentProps, withRouter } from 'react-router-dom';
import React, { useEffect } from 'react';
import ReactGA from 'react-ga';
import { Update } from 'history';
import getClientId from 'utils/getClientId';

const TRACKING_ID = 'UA-151199787-1';

function sendPageView({ location }: Update) {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
}

const GAListener: React.FC<RouteComponentProps> = ({ children, history }) => {
  useEffect(() => {
    const testMode = process.env.NODE_ENV === 'test';
    ReactGA.initialize(TRACKING_ID, {
      gaOptions: { clientId: getClientId() },
      testMode,
    });
    return history.listen(sendPageView);
  }, [history]);

  return <>{children}</>;
};

export default withRouter(GAListener);
