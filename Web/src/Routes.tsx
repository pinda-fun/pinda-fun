import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loading from './components/common/Loading';
import RoomPage from './room/RoomPage';

const LandingPage = lazy(() => import('./components/landing'));
const BalloonShake = lazy(() => import('./games/BalloonShake'));

const Routes: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/balloon-game" component={BalloonShake} />
      <Route exact path="/room" component={RoomPage} />
    </Switch>
  </Suspense>
);

export default Routes;
