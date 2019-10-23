import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import PhoenixComm from 'components/room/PhoenixComm';
import CommContext from 'components/room/CommContext';
import Loading from './components/common/Loading';

const LandingPage = lazy(() => import('components/landing'));
const CreateRoomPage = lazy(() => import('components/create-room'));
const JoinRoomPage = lazy(() => import('components/join-room'));
const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const MentalSums = lazy(() => import('components/games/MentalSums'));

const comm = new PhoenixComm();

const RoutesWithCommContext: React.FC = () => (
  <CommContext.Provider value={comm}>
    <Switch>
      <Route path="/new" component={CreateRoomPage} />
      <Route exact path="/join" component={JoinRoomPage} />
      <Route path="/join/:id" component={JoinRoomPage} />
      <Route exact path="/balloon-game" component={BalloonShake} />
      <Route exact path="/sums-game" component={MentalSums} />
    </Switch>
  </CommContext.Provider>
);

const Routes: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <RoutesWithCommContext />
    </Switch>
  </Suspense>
);

export default Routes;
