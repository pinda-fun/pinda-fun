import { RouteComponentProps, withRouter } from 'react-router-dom';
import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { Location } from 'history';
import getClientId from 'utils/getClientId';

const TRACKING_ID = 'UA-151199787-1';

function sendPageView(location: Location) {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
}

interface Props extends RouteComponentProps {
  children: JSX.Element,
}

const GAListener: React.FC<Props> = ({ children, history }) => {
  useEffect(() => {
    const testMode = process.env.NODE_ENV === 'test';
    ReactGA.initialize(TRACKING_ID, { gaOptions: { clientId: getClientId() }, testMode });
    return history.listen(sendPageView);
  }, [history]);

  return children;
};

export default withRouter(GAListener);
