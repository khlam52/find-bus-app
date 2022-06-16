import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import i18n from 'i18n-js';
import _ from 'lodash';
import { Platform } from 'react-native';
import { openSettings } from 'react-native-permissions';

import { WarningIcon } from '~src/assets/images';
import { store } from '~src/contexts/store/Store';
import { sw } from '~src/styles/Mixins';
import AlertHelper from '~src/utils/AlertHelper';
import CommonUtil from '~src/utils/CommonUtil';
import PermissionUtil from '~src/utils/PermissionUtil';

let isEnableForegroundNotification = true;

// 1. request permission
// 2. check notification is on/off, if off show alert prompt
// 3. store fcm token if any
const register = async () => {
  console.log('PushService ->register');
  await messaging().requestPermission();
  try {
    await PermissionUtil.checkPushNotificationIsEnable();
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('PushService ->register -> fcmToken: ', fcmToken);
      store.getActions().appState.setFcmToken(fcmToken);
      onMessage(isEnableForegroundNotification);
      setBackgroundMessageHandler();
      onNotificationOpenedApp();
      getInitialNotification();
      if (isEnableForegroundNotification) {
        notifeeGetInitialNotification();
        notifeeOnBackgroundEvent();
        notifeeOnForegroundEvent();
      }
    }
  } catch (error) {
    AlertHelper.showAlert(
      <WarningIcon width={sw(60)} height={sw(69)} />,
      i18n.t('ALERT.APP_TITLE'),
      i18n.t('MODAL.PUSH_NOTI.MESSAGE'),
      i18n.t('BUTTONS.SETTINGS'),
      i18n.t('BUTTONS.QUIT'),
      () => {
        openSettings().catch(() =>
          console.log('PushService -> register -> cannot open settings'),
        );
      },
      () => {
        CommonUtil.exitApp();
      },
    );
  }
};

// on call when receive push notification in foreground
const onMessage = (isEnableForegroundPush = false) => {
  messaging().onMessage(async (remoteMessage) => {
    console.log(
      'PushService -> onMessage -> remoteMessage:',
      JSON.stringify(remoteMessage),
    );

    if (isEnableForegroundPush) {
      console.log(
        'PushService -> onMessage -> create notification when app in foreground',
      );
      onDisplayNotification(remoteMessage);
    }
  });
};

const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(
      'PushService -> setBackgroundMessageHandler -> remoteMessage handled in the background!',
      remoteMessage,
    );
  });
};

async function onDisplayNotification(remoteMessage) {
  // create notification in notification center if the app is in foreground
  let pushTitle = _.get(remoteMessage, 'notification.title', '');

  let pushSubtitle = _.get(
    remoteMessage,
    Platform.OS === 'ios' ? 'notification.ios.subtitle' : '',
    '',
  );
  let pushBody = _.get(remoteMessage, 'notification.body', '');

  const channelId = await notifee.createChannel({
    id: 'RNProject',
    name: 'RNProjectChannel',
  });

  await notifee.displayNotification({
    title: pushTitle,
    body: pushBody,
    android: {
      channelId,
      pressAction: {
        id: 'android1234',
        launchActivity: 'default',
      },
    },
    ios: {
      pressAction: {
        id: 'ios1234',
      },
    },
  });
}

//------- handle notification clicked ------- //
// Assume a message-notification contains a "type" property in the data payload of the screen to open
// call only when clicking a notification which the app in background
const onNotificationOpenedApp = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      'PushService -> onNotificationOpenedApp -> remoteMessage:',
      remoteMessage,
    );
    handleNotificationClicked();
  });
};

// Check whether an initial notification is available
// call only when clicking a notification to open the app in quit state
const getInitialNotification = () => {
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      console.log(
        'PushService -> getInitialNotification -> remoteMessage:',
        remoteMessage,
      );
      handleNotificationClicked();
    });
};

// ====================== Only for foreground notification is enable  ====================== //
// clicking the notification when app in quit state, android will call this
const notifeeGetInitialNotification = async () => {
  if (Platform.OS === 'android') {
    const initialNotification = await notifee.getInitialNotification();
    console.log(
      'PushService -> notifeeGetInitialNotification -> initialNotification:',
      initialNotification,
    );
    handleNotificationClicked();
  }
};

// clicking the notification when app in background, android will call this
const notifeeOnBackgroundEvent = () => {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log(
        'PushService -> notifeeOnBackgroundEvent -> notification type:',
        type,
      );
      console.log(
        'PushService -> notifeeOnBackgroundEvent -> notification details:',
        detail,
      );
      handleNotificationClicked();
    }
  });
};

// clicking the notification when app in quit, background, foreground, ios will call this
// clicking the notification when app in foreground, android will call this
const notifeeOnForegroundEvent = () => {
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log(
        'PushService -> notifeeOnForegroundEvent -> notification type:',
        type,
      );
      console.log(
        'PushService -> notifeeOnForegroundEvent -> notification details:',
        detail,
      );
      handleNotificationClicked();
    }
  });
};
// ====================== Only for foreground notification is enable  ====================== //

//------- handle notification clicked ------- //

const handleNotificationClicked = () => {
  // To be complete if there is any notification data need to handle, like jumping page.
  console.log('PushService -> handleNotificationClicked');
};

export default { register };
