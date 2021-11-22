import React, { lazy, Suspense } from 'react';
import { Routes as ReactRouterRoutes, Route, Navigate } from 'react-router-dom';
import PhoenixComm from 'components/room/comm/phoenix/PhoenixComm';
import CommContext from 'components/room/comm/CommContext';
import Loading from 'components/common/Loading';
import FeedbackPage from 'components/feedback';
import usePageTracking from 'utils/usePageTracking';

const LandingPage = lazy(() => import('components/landing'));
const CreateRoomPage = lazy(() => import('components/create-room'));
const JoinRoomPage = lazy(() => import('components/join-room'));
const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const PandaSequence = lazy(() => import('components/games/PandaSequence'));
const MentalSums = lazy(() => import('components/games/MentalSums'));

const comm = new PhoenixComm();

const Routes: React.FC = () => {
  usePageTracking();

  return (
    <Suspense fallback={<Loading />}>
      <CommContext.Provider value={comm}>
        <ReactRouterRoutes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/new" element={<CreateRoomPage />} />
          <Route path="/join" element={<JoinRoomPage />} />
          <Route path="/join/:id" element={<JoinRoomPage />} />
          {
            // Do not include some routes on real production website (still allow on deploy previews)
            // Return an array following https://stackoverflow.com/questions/58169397/redirect-doesnt-work-inside-switch-when-fragment-has-been-used
            !window.location.origin.includes('pinda.fun') && [
              <Route path="/balloon-game" element={<BalloonShake />} />,
              <Route path="/panda-sequence" element={<PandaSequence />} />,
              <Route path="/sums-game" element={<MentalSums />} />,
              <Route path="/feedback" element={<FeedbackPage />} />,
            ]
          }
          <Route path="*" element={<Navigate to="/" />} />
        </ReactRouterRoutes>
      </CommContext.Provider>
    </Suspense>
  );
};

export default Routes;
