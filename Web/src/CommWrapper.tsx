import PhoenixComm from 'components/room/comm/phoenix/PhoenixComm';
import CommContext from 'components/room/comm/CommContext';
import { Outlet } from 'react-router-dom';

const comm = new PhoenixComm();

const CommWrapper = () => (
  <CommContext.Provider value={comm}>
    <Outlet />
  </CommContext.Provider>
);
export default CommWrapper;