import { useContext } from 'react';

import LocalizationContext from '~src/contexts/i18n/LocalizationContext';

const useLocalization = (props) => {
  return useContext(LocalizationContext);
};

export default useLocalization;
