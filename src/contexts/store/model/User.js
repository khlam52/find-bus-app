import React from 'react';

import { action, thunk } from 'easy-peasy';
import i18n from 'i18n-js';
import _ from 'lodash';

import { WarningIcon } from '~src/assets/images';
import RootNavigation from '~src/navigations/RootNavigation';
import Route from '~src/navigations/Route';
import AlertHelper from '~src/utils/AlertHelper';
import CustomEventEmitter from '~src/utils/CustomEventEmitter';

let initialUserProfile = {
  usrId: '',
  fullname: '',
  email: '',
  nickname: '',
  fcrUcr: '',
  engName: '',
  mobCtryCod: '',
  mobNum: '',
  lstSuccessTS: '',
  lstAttemptTS: '',
};

let loginResponse = {
  lstSuccessTS: '',
};

export default {
  isLoggedIn: false,
  userProfile: initialUserProfile,
  loginResponse: loginResponse,

  // Login
  setLogin: thunk(async (actions, payload) => {
    actions.setLoginState(payload);
    actions.updateUserProfile(payload);
    RootNavigation.navigate(Route.MAIN_STACK, { screen: Route.TAB_STACK });
    CustomEventEmitter.emit(CustomEventEmitter.EVENT_USER_LOGIN);
  }),
  setLoginState: action((state, payload) => {
    console.log('User -> setLogin');
    state.isLoggedIn = true;
  }),

  updateUserProfile: action((state, payload) => {
    console.log('User -> updateUserProfile');
    console.log('payload:', payload);
    state.userProfile = payload.userProfile;
  }),

  // Logout
  setLogoutState: action((state, payload) => {
    console.log('User -> setLogout', payload);
    state.userProfile = initialUserProfile;
    state.isLoggedIn = false;
  }),

  setLogout: thunk(async (actions, payload) => {
    //Data Config
    CustomEventEmitter.emit(CustomEventEmitter.EVENT_USER_LOGOUT);

    actions.setLogoutState(payload);

    // AuthService.logout().catch((error) => {
    //   console.log('User -> AuthService logout -> error :', error);
    // });

    RootNavigation.navigate(Route.LANDING_SCREEN);
    if (_.get(payload, 'isIdleLogout', false)) {
      let icon = <WarningIcon width={60} height={69} fill={'#D9000D'} />;

      AlertHelper.showAlertWithOneButton(
        icon,
        i18n.t('ALERT.APP_TITLE'),
        i18n.t('ERROR.IDLED_FOR_15_MINUTES_MSG'),
        i18n.t('BUTTONS.QUIT'),
        () => {},
      );
    }
  }),

  updateUserId: action((state, payload) => {
    state.userProfile.usrId = payload.usrId;
  }),
};
