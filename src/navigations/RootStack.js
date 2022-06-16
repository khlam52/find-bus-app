import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { MainStack } from '~src/navigations/MainStack';
import RootNavigation from '~src/navigations/RootNavigation';
import Route from '~src/navigations/Route';
import AlertScreen from '~src/screens/modals/AlertScreen';
import HtmlCodeViewModal from '~src/screens/modals/HtmlCodeViewModal';
import PDFModal from '~src/screens/modals/PDFModal';
import SpecialAnnouncementModal from '~src/screens/modals/SpecialAnnouncementModal';
import WebViewModal from '~src/screens/modals/WebViewModal';
import CustomEventEmitter from '~src/utils/CustomEventEmitter';

const commonModals = {};
commonModals[Route.PDF_MODAL] = PDFModal;
commonModals[Route.WEBVIEW_MODAL] = WebViewModal;
commonModals[Route.ALERT_SCREEN] = AlertScreen;
commonModals[Route.HTML_CODE_VIEW_MODAL] = HtmlCodeViewModal;
commonModals[Route.SPECIAL_ANNOUNCEMENT_MODAL] = SpecialAnnouncementModal;

const Stack = createStackNavigator();

export default function RootStack() {
  React.useEffect(() => {
    return () => (RootNavigation.isReadyRef.current = false);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer
        ref={RootNavigation.navigationRef}
        onStateChange={RootNavigation.onStateChange}
        onReady={() => {
          console.log('RootStack -> NavigationContainer -> onReady');
          RootNavigation.isReadyRef.current = true;
          RootNavigation.routeNameRef.current = RootNavigation.navigationRef.current.getCurrentRoute().name;
          CustomEventEmitter.emit(
            CustomEventEmitter.EVENT_NAVIGATION_CONTAINER_IS_READY,
          );
        }}>
        <Stack.Navigator
          presentation="modal"
          initialRouteName={Route.MAIN_STACK}
          screenOptions={({ route }) => {
            return RootNavigation.getScreenOptions(route);
          }}>
          {Object.entries({
            // Use the screens normally
            ...commonModals,
            // Use some screens conditionally based on some condition
          }).map(([name, component], index) => {
            const keyIdn = name + '-' + index;
            return (
              <Stack.Screen
                key={keyIdn}
                name={name}
                component={component}
                options={{ headerShown: false, gestureEnabled: false }}
              />
            );
          })}
          <Stack.Screen
            name={Route.MAIN_STACK}
            component={MainStack}
            options={{ headerShown: false, gestureEnabled: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
