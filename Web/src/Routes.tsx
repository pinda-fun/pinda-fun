import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loading from './components/common/Loading';
import RoomPage from './components/room/RoomPage';

const LandingPage = lazy(() => import('components/landing'));
const CreateRoomPage = lazy(() => import('components/create-room'));
const JoinRoomPage = lazy(() => import('components/join-room'));
const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const PandaSequence = lazy(() => import('components/games/PandaSequence'));

const Routes: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route path="/new" component={CreateRoomPage} />
      <Route path="/join" component={JoinRoomPage} />
      <Route exact path="/balloon-game" component={BalloonShake} />
      <Route exact path="/panda-sequence" component={PandaSequence} />
      <Route exact path="/room" component={RoomPage} />
    </Switch>
  </Suspense>
);

export default Routes;
