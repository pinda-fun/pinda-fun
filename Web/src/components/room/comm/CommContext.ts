import React from 'react';
import Comm from './Comm';

const CommContext = React.createContext<Comm>({} as Comm);
export default CommContext;
