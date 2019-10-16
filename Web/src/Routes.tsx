import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";
import Loading from "./components/common/Loading";
import Room from "./Room";

const LandingPage = lazy(() => import("./components/landing"));

const RoomPage: React.FC = () => {
  return (
    <div>
      <Room roomId="lobby" />
    </div>
  );
};

const Routes: React.FC = () => (
  <Suspense fallback={<Loading />}>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/room" component={RoomPage} />
    </Switch>
  </Suspense>
);

export default Routes;
