import React from 'react';

import useAppContext from './app';
import useLocalization from './i18n';
import useAppTheme from './theme';

export function withAllContext(Component) {
  return React.forwardRef((props, ref) => {
    return (
      <Component
        ref={ref}
        {...props}
        appTheme={useAppTheme()}
        appContext={useAppContext()}
        appLocalization={useLocalization()}
      />
    );
  });
}
