import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loading from './components/common/Loading';
import TestJoinRoomPage from './components/room/JoinRoomPage';

const LandingPage = lazy(() => import('components/landing'));
const CreateRoomPage = lazy(() => import('components/create-room'));
const JoinRoomPage = lazy(() => import('components/join-room'));
const BalloonShake = lazy(() => import('components/games/BalloonShake'));

const Routes: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/new" component={CreateRoomPage} />
      <Route path="/join" component={JoinRoomPage} />
      <Route exact path="/balloon-game" component={BalloonShake} />
      <Route exact path="/test/joinroom" component={TestJoinRoomPage} />
    </Switch>
  </Suspense>
);

export default Routes;
