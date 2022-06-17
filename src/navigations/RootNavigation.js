import * as React from 'react';

import analytics from '@react-native-firebase/analytics';
import { StackActions, CommonActions } from '@react-navigation/native';

import Route from '~src/navigations/Route';

const isReadyRef = React.createRef();
const navigationRef = React.createRef();
const routeNameRef = React.createRef();
var previousRouteName = '';
var currentRouteName = '';

const getScreenOptions = (route) => {
  // console.log('RootNavigation -> getScreenOptions -> route:', route);

  let defaultOption = {
    cardStyle: { backgroundColor: 'transparent' },
    cardOverlayEnabled: true,
    animationEnabled: false,
    transparentCard: true,
    gestureEnabled: false,
    presentation: 'transparentModal',
  };

  let modalOption = {
    ...defaultOption,
    cardStyleInterpolator: ({ current: { progress } }) => ({
      cardStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 0.5, 0.9, 1],
          outputRange: [0, 0.25, 0.7, 1],
        }),
      },
      overlayStyle: {
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.6],
          extrapolate: 'clamp',
        }),
      },
    }),
  };

  const routeName = route.name;
  switch (routeName) {
    case Route.COMMON_ALERT_MODAL:
    case Route.ALERT_SCREEN:
    case Route.SPECIAL_ANNOUNCEMENT_MODAL:
    case Route.BOTTOM_SHEET_SELECTION_MODAL:
      return modalOption;
    case Route.MAIN_STACK:
    case Route.ONBOARDING_TUTORIAL_MODAL:
    case Route.PERMISSION_SCREEN:
      return defaultOption;
    case Route.BOTTOM_SHEET_MODAL:
      return defaultOption;
    default:
      return null;
  }
};

// Gets the current screen from navigation state
const getActiveRouteName = (state) => {
  const route = state.routes[state.index];

  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state);
  }

  return route.name;
};

const onStateChange = async (state) => {
  console.log(
    'RootStackScreen -> onStateChange -> currentRouteName:',
    navigationRef.current.getCurrentRoute().name,
  );

  previousRouteName = routeNameRef.current;
  currentRouteName = navigationRef.current.getCurrentRoute().name;

  if (previousRouteName !== currentRouteName) {
    await analytics().logScreenView({
      screen_name: currentRouteName,
      screen_class: currentRouteName,
    });
    console.log(
      'RootStackScreen -> onStateChange -> logScreen: ',
      currentRouteName,
    );
  }

  // console.log('RootStackScreen -> onStateChange -> state: ', state);

  routeNameRef.current = currentRouteName;
};

function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
    console.log("Attempted to use Navigate but the app hasn't mounted!!!");
  }
}

function push(...args) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(StackActions.push(...args));
  } else {
  }
}

function back(...args) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(CommonActions.goBack());
  } else {
  }
}

function replace(...args) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch(StackActions.replace(args));
  } else {
  }
}

function remove(screenName) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current?.dispatch((state) => {
      // Remove the home route from the stack
      const routes = state.routes.filter((r) => r.name !== screenName);
      console.log('RootNavigation -> routes: ', routes);
      return CommonActions.reset({
        ...state,
        routes,
        index: routes.length - 1,
      });
    });
  } else {
  }
}

export default {
  isReadyRef,
  navigationRef,
  routeNameRef,
  previousRouteName,
  currentRouteName,
  getScreenOptions,
  getActiveRouteName,
  onStateChange,
  navigate,
  push,
  back,
  replace,
  remove,
};
