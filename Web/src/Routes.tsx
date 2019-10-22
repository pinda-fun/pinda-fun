import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loading from './components/common/Loading';
import ChannelContext, { useControlledErrorableChannel } from 'components/room/ChannelContext';

const LandingPage = lazy(() => import('components/landing'));
const CreateRoomPage = lazy(() => import('components/create-room'));
const JoinRoomPage = lazy(() => import('components/join-room'));
const BalloonShake = lazy(() => import('components/games/BalloonShake'));

const RoutesWithChannelContext: React.FC = () => (
  <ChannelContext.Provider value={useControlledErrorableChannel()}>
    <Switch>
      <Route path="/new" component={CreateRoomPage} />
      <Route exact path="/join" component={JoinRoomPage} />
      <Route path="/join/:id" component={JoinRoomPage} />
      <Route exact path="/balloon-game" component={BalloonShake} />
    </Switch>
  </ChannelContext.Provider>
);

const Routes: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <RoutesWithChannelContext />
    </Switch>
  </Suspense>
);

export default Routes;
