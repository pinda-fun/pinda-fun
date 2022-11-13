import LandingPage from 'components/landing';
import React, { lazy } from 'react';
import { Routes as ReactRouterRoutes, Route, Navigate } from 'react-router-dom';
import usePageTracking from 'utils/usePageTracking';

const CreateRoomPage = lazy(() => import('components/create-room'));
const JoinRoomPage = lazy(() => import('components/join-room'));
const BalloonShake = lazy(() => import('components/games/BalloonShake'));
const PandaSequence = lazy(() => import('components/games/PandaSequence'));
const MentalSums = lazy(() => import('components/games/MentalSums'));
const FeedbackPage = lazy(() => import('components/feedback'));
const CommWrapper = lazy(() => import('CommWrapper'));

const Routes: React.FC = () => {
  usePageTracking();

  return (
    <ReactRouterRoutes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<CommWrapper />}>
        <Route path="/new" element={<CreateRoomPage />} />
        <Route path="/join" element={<JoinRoomPage />} />
        <Route path="/join/:id" element={<JoinRoomPage />} />
      </Route>
      {
        // Do not include some routes on real production website (still allow on deploy previews)
        // Return an array following https://stackoverflow.com/questions/58169397/redirect-doesnt-work-inside-switch-when-fragment-has-been-used
        !window.location.origin.includes('pinda.fun') && <>
          <Route path="/balloon-game" element={<BalloonShake />} />
          <Route path="/panda-sequence" element={<PandaSequence />} />
          <Route path="/sums-game" element={<MentalSums />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </>
      }
      <Route path="*" element={<Navigate to="/" />} />
    </ReactRouterRoutes>
  );
};

export default Routes;
