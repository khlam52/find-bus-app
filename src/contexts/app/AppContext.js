import React, { useState } from 'react';

import { StatusBar, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

import useAppTheme from '../theme';
import Loader from '~src/components/Loader';

const AppContext = React.createContext();

export const AppContextProvider = ({ children }) => {
  const [isFinishLaunching, setIsFinishLaunching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    theme: { settings: theme },
  } = useAppTheme();

  const showLoading = () => {
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  let deviceBrand = DeviceInfo.getBrand();

  return (
    <AppContext.Provider
      value={{
        showLoading,
        hideLoading,
        isFinishLaunching,
        setIsFinishLaunching,
      }}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.colors.background}
        translucent={
          deviceBrand.toLowerCase() !== 'xiaomi' && Platform.OS === 'android'
        }
      />
      {children}
      <Loader isLoaderShow={isLoading} />
    </AppContext.Provider>
  );
};

export default AppContext;
