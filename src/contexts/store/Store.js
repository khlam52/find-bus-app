import { createStore } from 'easy-peasy';

import AppState from '~src/contexts/store/model/AppState';
import User from '~src/contexts/store/model/User';

export const store = createStore({
  user: User,
  appState: AppState,
});

// remember the current value of state variable, not to directly access store.getState
export let currentAccessToken;
export let currentSessionID;
export let setLogin;
export let setLogout;
export let setLoginResponseState;
export let isLoggedIn;
export let updateUserProfile;
export let currentFcmToken;

function handleChange() {
  currentAccessToken = store.getState().appState.accessToken;
  currentSessionID = store.getState().appState.sessionID;
  isLoggedIn = store.getState().appState.isLoggedIn;
  setLogin = store.dispatch.user.setLogin;
  setLogout = store.dispatch.user.setLogout;
  setLoginResponseState = store.dispatch.user.setLoginResponseState;
  updateUserProfile = store.dispatch.user.updateUserProfile;
  currentFcmToken = store.getState().appState.fcmToken;
}
store.subscribe(handleChange);
