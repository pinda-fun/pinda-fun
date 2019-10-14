import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

const LandingPage = lazy(() => import('./components/landing'));

const Routes: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Switch>
      <Route exact path="/" component={LandingPage} />
    </Switch>
  </Suspense>
);

export default Routes;
