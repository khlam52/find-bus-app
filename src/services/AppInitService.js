import DeviceInfo from 'react-native-device-info';

import ApiService from './ApiService';
import StorageService from './StorageService';
import * as AppError from '~src/constants/AppError';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '~src/constants/Constant';
import { store } from '~src/contexts/store/Store';
import CommonUtil from '~src/utils/CommonUtil';

async function checkAppUpdate() {
  let isNeedForceUpgrade = true;
  let isNeedSoftUpgrade = false;
  return new Promise(async (resolve, reject) => {
    try {
      let btnGoAppStore = async () => {
        await CommonUtil.goToAppStore(APP_STORE_URL, GOOGLE_PLAY_URL);
        CommonUtil.exitApp();
        resolve();
      };

      let profileResponse = await ApiService.getAppProfile();
      console.log(
        'AppInitService -> checkAppVersion -> profileResponse: ',
        profileResponse,
      );
      // 1. Set Idle
      store
        .getActions()
        .appState.setLogonSessionExpiryTime(
          profileResponse.logonSessionExpiryTime,
        );
      store
        .getActions()
        .appState.setLogonSessionWarningTime(
          profileResponse.logonSessionWarningTime,
        );
      // 2. check App version
      let appVersionsAdviceRequiredList =
        profileResponse.appVersionsAdviceRequired;
      let appVersionsSupportedList = profileResponse.appVersionsSupported;
      let currentAppVersion = DeviceInfo.getVersion();
      console.log(
        'AppInitService -> checkAppVersion -> currentAppVersion: ',
        currentAppVersion,
      );

      // 1. check force upgrade
      appVersionsSupportedList.forEach((value) => {
        if (currentAppVersion === value) {
          isNeedForceUpgrade = false;
        }
      });

      let isNotShowSoftUpdate = await StorageService.getIsNotShowSoftUpdate();
      // 2. check soft upgrade
      appVersionsAdviceRequiredList.forEach((value) => {
        if (currentAppVersion === value && !isNotShowSoftUpdate) {
          isNeedSoftUpgrade = true;
        }
      });

      if (isNeedForceUpgrade) {
        console.log('AppInitService -> checkAppVersion: Force Update');
        CommonUtil.showForceUpgrade(btnGoAppStore);
      } else if (isNeedSoftUpgrade) {
        let btnGoNextPage = async () => {
          resolve();
        };

        console.log('AppInitService -> checkAppVersion: Soft Update');
        CommonUtil.showSoftUpdate(btnGoAppStore, btnGoNextPage);
      } else {
        resolve(AppError.SUCCESS);
      }
    } catch (e) {
      console.log('AppInitService -> checkAppUpdate -> error: ', e);
      reject(e);
    }
  });
}
export default {
  checkAppUpdate,
};
