import React, { Suspense } from 'react';
import Loading from 'components/common/Loading';

const Router = React.lazy(() => import('./Router'));

const App: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Router />
  </Suspense>
);

export default App;
