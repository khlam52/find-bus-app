import React, { useState, useEffect, useRef } from 'react';

import { useStoreActions, useStoreState } from 'easy-peasy';
import i18n from 'i18n-js';
import { View, PanResponder } from 'react-native';

import { WarningIcon } from '~src/assets/images';
import ApiService from '~src/services/ApiService';
import BackgroundTimerService from '~src/services/BackgroundTimerService';
import AlertHelper from '~src/utils/AlertHelper';
import CustomEventEmitter from '~src/utils/CustomEventEmitter';
import ErrorUtil from '~src/utils/ErrorUtil';

export const IdleService = ({ children }) => {
  const enableIdleService = useRef(false);
  const setLogout = useStoreActions((actions) => actions.user.setLogout);
  const [useEffectStarted, setUseEffectStarted] = useState(false);
  const appState = useStoreState((state) => state.appState);
  const logonSessionExpiryTime = useRef(appState.logonSessionExpiryTime);
  const logonSessionWarningTime = useRef(appState.logonSessionWarningTime);

  //For refresh session function. user touched the app, ten min auto call session update
  const isOnPanResponder = useRef(false);

  const showIdleWarning = () => {
    console.log('IdleService -> startForegroundIdleTimer -> warningCallback ');
    let icon = <WarningIcon width={60} height={69} fill={'#D9000D'} />;
    AlertHelper.showAlert(
      icon,
      i18n.t('ALERT.APP_TITLE'),
      i18n
        .t('ERROR.IDLED_FOR_10_MINUTES_MSG')
        .replace(
          '{idleTime}',
          logonSessionExpiryTime.current - logonSessionWarningTime.current,
        ),
      i18n.t('BUTTONS.CONTINUE'),
      i18n.t('BUTTONS.LOGOUT'),

      () => {
        refreshSession();
      },
      async () => {
        await cleanTimer();
        cleanRefreshSessionTime();
        setLogout();
      },
    );
  };

  const idleForceLogout = async () => {
    console.log('IdleService -> idleForceLogout -> ');
    await cleanTimer();
    cleanRefreshSessionTime();
    await setLogout({ isIdleLogout: true });
  };

  const refreshSession = () => {
    console.log('IdleService -> refreshSession');
    try {
      ApiService.refreshSession();
    } catch (error) {
      console.log('IdleService -> refreshSession -> error');
      console.log(error);
      ErrorUtil.showApiErrorMsgAlert(error);
    }

    cleanRefreshSessionTime();
  };

  let refreshSessionTimer = useRef(
    new BackgroundTimerService(
      refreshSession,
      60 * appState.refreshSessionTime,
    ),
  );

  let warningBackgroundTimer = useRef(
    new BackgroundTimerService(
      showIdleWarning,
      60 * appState.logonSessionWarningTime,
    ),
  );
  let logoutBackgroundTimer = useRef(
    new BackgroundTimerService(
      idleForceLogout,
      60 * appState.logonSessionExpiryTime,
    ),
  );

  useEffect(() => {
    // Tracking LoginSession Value if Changed.
    warningBackgroundTimer.current.setDelay(
      60 * appState.logonSessionWarningTime,
    );
    logoutBackgroundTimer.current.setDelay(
      60 * appState.logonSessionExpiryTime,
    );
    logonSessionExpiryTime.current = appState.logonSessionExpiryTime;
    logonSessionWarningTime.current = appState.logonSessionWarningTime;
  }, [appState.logonSessionWarningTime, appState.logonSessionExpiryTime]);

  useEffect(() => {
    registerEvent();
    setUseEffectStarted(true);
    return () => {
      removeEventListener();
      cleanTimer();
      cleanRefreshSessionTime();
    };
  }, [!useEffectStarted]);

  const removeEventListener = () => {
    console.log('IdleService -> removeEventListener');
    CustomEventEmitter.removeAllListenerByEventName(
      CustomEventEmitter.EVENT_USER_LOGOUT,
    );
    CustomEventEmitter.removeAllListenerByEventName(
      CustomEventEmitter.EVENT_USER_LOGIN,
    );
  };

  const registerEvent = () => {
    console.log('IdleService -> useEffect -> registerEvent');
    CustomEventEmitter.on(CustomEventEmitter.EVENT_USER_LOGOUT, () => {
      cleanTimer();
      enableIdleService.current = false;
    });
    CustomEventEmitter.on(CustomEventEmitter.EVENT_USER_LOGIN, () => {
      enableIdleService.current = true;
      resetTimerForPanResponder();
    });
  };
  const cleanRefreshSessionTime = () => {
    refreshSessionTimer.current.cleanTimer();
    isOnPanResponder.current = false;
  };
  const cleanTimer = () => {
    warningBackgroundTimer.current.cleanTimer();
    logoutBackgroundTimer.current.cleanTimer();
  };

  const startIdleTimer = () => {
    warningBackgroundTimer.current.starTimer();
    logoutBackgroundTimer.current.starTimer();
  };

  const resetTimerDueToActivity = () => {
    cleanTimer();
    startIdleTimer();
  };

  const resetTimerForPanResponder = () => {
    // Idle Timer
    if (enableIdleService.current) {
      resetTimerDueToActivity();
    }
    //For refresh session function. user touched the app, ten min auto call session update
    if (!isOnPanResponder.current) {
      refreshSessionTimer.current.starTimer();
      isOnPanResponder.current = true;
    }
    return false;
  };
  const [panResponder, _] = useState(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: resetTimerForPanResponder,
      onPanResponderTerminationRequest: resetTimerForPanResponder,
      onStartShouldSetPanResponderCapture: resetTimerForPanResponder,
    }),
  );

  return (
    <View style={{ flex: 1 }} collapsable={false} {...panResponder.panHandlers}>
      {children}
    </View>
  );
};
