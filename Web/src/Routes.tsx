import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PhoenixComm from 'components/room/comm/phoenix/PhoenixComm';
import CommContext from 'components/room/comm/CommContext';
import Loading from 'components/common/Loading';
import FeedbackPage from 'components/feedback';

const LandingPage = lazy(() => import('components/landing'));
const CreateRoomPage = lazy(() => import('components/create-room'));
const JoinRoomPage = lazy(() => import('components/join-room'));
const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const PandaSequence = lazy(() => import('components/games/PandaSequence'));
const MentalSums = lazy(() => import('components/games/MentalSums'));

const comm = new PhoenixComm();

const RoutesWithCommContext: React.FC = () => (
  <CommContext.Provider value={comm}>
    <Switch>
      <Route path="/new" component={CreateRoomPage} />
      <Route exact path="/join" component={JoinRoomPage} />
      <Route path="/join/:id" component={JoinRoomPage} />
      {
        // Do not include some routes on real production website (still allow on deploy previews)
        !window.location.origin.includes('pinda.fun') && (
          <>
            <Route exact path="/balloon-game" component={BalloonShake} />
            <Route exact path="/panda-sequence" component={PandaSequence} />
            <Route exact path="/sums-game" component={MentalSums} />
            <Route exact path="/feedback" component={FeedbackPage} />
          </>
        )
      }
      <Redirect to="/" />
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
