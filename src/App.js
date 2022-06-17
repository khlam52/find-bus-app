import React from 'react';

import { StoreProvider } from 'easy-peasy';
import { LogBox } from 'react-native';

import { AppContextProvider } from './contexts/app/AppContext';
import { AppConfig } from '~src/config';
import { LocalizationContextProvider } from '~src/contexts/i18n/LocalizationContext';
import { store } from '~src/contexts/store/Store';
import useAppTheme from '~src/contexts/theme';
import { ThemeContextProvider } from '~src/contexts/theme/ThemeContext';
import RootStack from '~src/navigations/RootStack';

if (!(AppConfig.ENV === 'dev' || AppConfig.ENV === 'sit')) {
  LogBox.ignoreAllLogs();
}

const Root = () => {
  return (
    <LocalizationContextProvider>
      <ThemeContextProvider>
        <ThemeConsumer />
      </ThemeContextProvider>
    </LocalizationContextProvider>
  );
};

const ThemeConsumer = (props) => {
  const { theme } = useAppTheme();
  console.log('THEME >>>>> -- : ', theme);
  console.log('PROPS >>>>> -- : ', props);
  return (
    <StoreProvider store={store}>
      <AppContextProvider>
        <RootStack />
      </AppContextProvider>
    </StoreProvider>
  );
};

//temp workaround for react-native-gesture-handler in react-native 0.61
// take a look https://github.com/react-native-community/releases/issues/140#issuecomment-532819601
export default Root;
