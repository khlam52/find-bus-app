import React, { useState } from 'react';

import { THEME_NAME } from '~src/constants/Constant';
import { AppDarkTheme, AppLightTheme } from '~src/contexts/theme/AppTheme';

// import { StorageService } from '~src/services';

const ThemeContext = React.createContext();

export const ThemeContextProvider = ({ theme, children }) => {
  const [themeObj, changeTheme] = useState(theme || AppDarkTheme);

  const setTheme = (t) => {
    const themeObjCaptured =
      t.toUpperCase() === THEME_NAME.DARK ? AppDarkTheme : AppLightTheme;
    changeTheme(themeObjCaptured);
  };

  const isHiddenByTheme = ({
    route: { name: routeName },
    displayName: displayObjectName,
    themeName = themeObj.name,
  }) => {
    const { displays } = themeObj;
    if (
      displays[routeName] === undefined ||
      displays[routeName][displayObjectName] === undefined
    )
      return false;
    return displays[routeName][displayObjectName] instanceof Array !== true
      ? !displays[routeName][displayObjectName]
      : displays[routeName][displayObjectName].indexOf(themeName) < 0;
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: AppDarkTheme,
        themeSwitched: themeObj,
        setTheme: (t) => setTheme(t),
        isHiddenByTheme: (_props) => isHiddenByTheme(_props),
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
