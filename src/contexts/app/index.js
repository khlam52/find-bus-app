import { useContext } from 'react';

import AppContext from './AppContext';

const useAppContext = (props) => {
  return useContext(AppContext);
};

export default useAppContext;
