import { Platform } from 'react-native';
import {
  request,
  PERMISSIONS,
  RESULTS,
  checkNotifications,
} from 'react-native-permissions';

const requestLocationPermission = () => {
  return new Promise((resolve, reject) => {
    let successCallback = (result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'PermissionUtil -> requestLocationPermission -> successCallback -> UNAVAILABLE This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'PermissionUtil -> requestLocationPermission -> successCallback -> DENIED The permission has not been requested / is denied but requestable',
          );
          break;
        case RESULTS.GRANTED:
          console.log(
            'PermissionUtil -> requestLocationPermission -> successCallback -> GRANTED  The permission is granted',
          );
          break;
        case RESULTS.BLOCKED:
          console.log(
            'PermissionUtil -> requestLocationPermission -> successCallback -> BLOCKED The permission is denied and not requestable anymore',
          );
          break;
      }
      resolve(result);
    };

    let failCallback = (error) => {
      console.log(
        'PermissionUtil -> requestLocationPermission -> failCallback -> The permission is denied and not requestable anymore',
      );
      reject('ERROR');
    };

    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    )
      .then(successCallback)
      .catch(failCallback);
  });
};

const checkPushNotificationIsEnable = () => {
  return new Promise((resolve, reject) => {
    let successCallback = ({ status, settings }) => {
      switch (status) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'PermissionUtil -> checkPushNotificationSetting -> successCallback -> UNAVAILABLE This feature is not available (on this device / in this context)',
          );
          reject(status);
          break;
        case RESULTS.DENIED:
          console.log(
            'PermissionUtil -> checkPushNotificationSetting -> successCallback -> DENIED The permission has not been requested / is denied but requestable',
          );
          reject(status);
          break;
        case RESULTS.GRANTED:
          // accepted push
          console.log(
            'PermissionUtil -> checkPushNotificationSetting -> successCallback -> GRANTED  The permission is granted',
          );
          resolve(status);
          break;
        case RESULTS.BLOCKED:
          // accepted push and turn off in setting
          console.log(
            'PermissionUtil -> checkPushNotificationSetting -> successCallback -> BLOCKED The permission is denied and not requestable anymore',
          );
          reject(status);
          break;
      }
    };

    let failCallback = (error) => {
      console.error(
        'PermissionUtil -> checkPushNotificationSetting -> failCallback',
        error,
      );
      reject('ERROR');
    };

    checkNotifications().then(successCallback).catch(failCallback);
  });
};

export default {
  requestLocationPermission,
  checkPushNotificationIsEnable,
};
