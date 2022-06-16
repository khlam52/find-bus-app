import { useContext } from 'react';

import ThemeContext from '~src/contexts/theme/ThemeContext';

const useAppTheme = (props) => {
  return useContext(ThemeContext);
};

export default useAppTheme;
