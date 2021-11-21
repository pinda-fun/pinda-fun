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
      <Route path="/new">
        <CreateRoomPage />
      </Route>
      <Route exact path="/join">
        <JoinRoomPage />
      </Route>
      <Route path="/join/:id">
        <JoinRoomPage />
      </Route>
      {
        // Do not include some routes on real production website (still allow on deploy previews)
        // Return an array following https://stackoverflow.com/questions/58169397/redirect-doesnt-work-inside-switch-when-fragment-has-been-used
        !window.location.origin.includes('pinda.fun') && [
          <Route exact path="/balloon-game">
            <BalloonShake />
          </Route>,
          <Route exact path="/panda-sequence">
            <PandaSequence />
          </Route>,
          <Route exact path="/sums-game">
            <MentalSums />
          </Route>,
          <Route exact path="/feedback">
            <FeedbackPage />
          </Route>,
        ]
      }
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  </CommContext.Provider>
);

const Routes: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact path="/">
        <LandingPage />
      </Route>
      <RoutesWithCommContext />
    </Switch>
  </Suspense>
);

export default Routes;
