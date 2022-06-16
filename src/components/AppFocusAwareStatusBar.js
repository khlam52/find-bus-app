import * as React from 'react';

import { useIsFocused } from '@react-navigation/native';
import { Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';

function AppFocusAwareStatusBar(props) {
  let deviceBrand = DeviceInfo.getBrand();
  return useIsFocused() ? (
    <StatusBar
      {...props}
      translucent={
        deviceBrand.toLowerCase() !== 'xiaomi' &&
        (Platform.OS === 'android' || props.translucent)
      }
    />
  ) : null;
}

export default AppFocusAwareStatusBar;
