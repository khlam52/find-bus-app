import { action } from 'easy-peasy';

export default {
  accessToken: null,
  sessionID: null,
  isFirstOpen: true,
  logonSessionExpiryTime: 15,
  logonSessionWarningTime: 10,
  refreshSessionTime: 10,
  fcmToken: null,

  setAccessToken: action((state, newAccessToken) => {
    state.accessToken = newAccessToken;
  }),

  setSessionID: action((state, newSessionID) => {
    state.sessionID = newSessionID;
  }),

  setIsFirstOpen: action((state, newIsFirstOpen) => {
    state.isFirstOpen = newIsFirstOpen;
  }),

  setLogonSessionExpiryTime: action((state, newLogonSessionExpiryTime) => {
    state.logonSessionExpiryTime = newLogonSessionExpiryTime;
  }),

  setLogonSessionWarningTime: action((state, newLogonSessionWarningTime) => {
    state.logonSessionWarningTime = newLogonSessionWarningTime;
  }),

  setFcmToken: action((state, newFcmToken) => {
    state.fcmToken = newFcmToken;
  }),
};
