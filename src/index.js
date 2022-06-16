import React from 'react';

import NetInfo from '@react-native-community/netinfo';
import { Text, TextInput, BackHandler, AppState, LogBox } from 'react-native';

import Root from '~src/App';

import CustomEventEmitter from './utils/CustomEventEmitter';

LogBox.ignoreLogs([
  'Setting a timer',
  'Non-serializable values were found in the navigation state',
]);
// USING CLASS COMPONENT AS A WORKAROUND FOR HOT RELOADING
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };

    Text.defaultProps = Text.defaultProps || {};
    TextInput.defaultProps = TextInput.defaultProps || {};
    // Ignore dynamic type scaling on iOS
    Text.defaultProps.allowFontScaling = false;
    TextInput.defaultProps.allowFontScaling = false;
  }

  initEvent = () => {
    console.log('App -> initEvent');

    CustomEventEmitter.on(
      CustomEventEmitter.EVENT_NAVIGATION_CONTAINER_IS_READY,
      () => {
        console.log(
          'App -> constructor -> EVENT_NAVIGATION_CONTAINER_IS_READY handler',
        );
        this.backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        );
      },
    );

    this.subscription = AppState.addEventListener(
      'change',
      this._handleAppStateChange,
    );

    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('App -> constructor -> NetInfo Connection type', state.type);
      console.log(
        'App -> constructor -> NetInfo Is connected?',
        state.isConnected,
      );
    });
  };

  removeEvent = () => {
    console.log('App -> removeEvent');
    this.backHandler.remove();
    this.subscription.remove();
  };

  componentDidMount() {
    this.initEvent();
  }

  componentWillUnmount() {
    // this.removeEvent();
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      CustomEventEmitter.emit(CustomEventEmitter.EVENT_APP_IN_FOREGROUND);
      console.log(
        'App -> _handleAppStateChange -> App has come to the foreground!',
      );
    }
    if (nextAppState === 'background') {
      CustomEventEmitter.emit(CustomEventEmitter.EVENT_APP_IN_BACKGROUND);
      console.log(
        'App -> _handleAppStateChange -> App has go to the background!',
      );
    }

    this.setState({ appState: nextAppState });
  };

  handleBackPress = () => {
    console.log('App -> handleBackPress');

    // if (currentRouteName === Route.HOME_SCREEN) {
    //   BackHandler.exitApp();
    // }
    return true;
  };
  render() {
    return <Root />;
  }
}
