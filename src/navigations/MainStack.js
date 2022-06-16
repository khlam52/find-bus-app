import React from 'react';

import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { useStoreState } from 'easy-peasy';
import DeviceInfo from 'react-native-device-info';

import useAppContext from '~src/contexts/app';
import Route from '~src/navigations/Route';
import { TabStack } from '~src/navigations/TabStack';
import LandingScreen from '~src/screens/auth/landing/LandingScreen';
import FavouriteScreen from '~src/screens/favourite/FavouriteScreen';
import FindBusScreen from '~src/screens/find-bus/FindBusScreen';
import OnboardingTutorialScreen from '~src/screens/first-launch/onboarding-tutorial/OnboardingTutorialScreen';
import SplashScreen from '~src/screens/first-launch/splash/SplashScreen';
import SearchScreen from '~src/screens/search/SearchScreen';

const Stack = createStackNavigator();
let deviceBrand = DeviceInfo.getBrand();

// Define multiple groups of screens in objects like this
const commonScreens = {};

// One time launching Screens
const launchingScreens = {};
launchingScreens[Route.SPLASH_SCREEN] = SplashScreen;
launchingScreens[Route.ONBOARDING_TUTORIAL_SCREEN] = OnboardingTutorialScreen;

// Pre login Screens
const authScreens = {};
authScreens[Route.LANDING_SCREEN] = LandingScreen;

// Post login Screens
const postLoginScreens = {};
postLoginScreens[Route.TAB_STACK] = TabStack;
postLoginScreens[Route.FIND_BUS_SCREEN] = FindBusScreen;
postLoginScreens[Route.SEARCH_SCREEN] = SearchScreen;
postLoginScreens[Route.FAVOURITE_SCREEN] = FavouriteScreen;

export const MainStack = () => {
  const isLoggedIn = useStoreState((state) => state.user.isLoggedIn);
  const { isFinishLaunching, setIsFinishLaunching } = useAppContext();

  const getInitialRouteName = () => {
    if (isFinishLaunching) {
      return Route.TAB_STACK;
    } else {
      return Route.SPLASH_SCREEN;
    }
  };

  console.log('MainStack -> getInitialRouteName :', getInitialRouteName());

  const getScreenCardStyleInterpolator = (name) => {
    switch (name) {
      case Route.LANDING_SCREEN:
      case Route.SPLASH_SCREEN:
      case Route.ONBOARDING_TUTORIAL_SCREEN:
        return CardStyleInterpolators.forNoAnimation;
      // case Route.XXX_SCREEN:
      //   return CardStyleInterpolators.forVerticalIOS;
      default:
        return CardStyleInterpolators.forHorizontalIOS;
    }
  };

  return (
    <Stack.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: true,
        cardStyleInterpolator:
          deviceBrand.toLowerCase() === 'huawei'
            ? CardStyleInterpolators.forRevealFromBottomAndroid
            : CardStyleInterpolators.forHorizontalIOS,
        gestureEnabled: false,
      }}>
      {Object.entries({
        // Use the screens normally
        // Use some screens conditionally based on some condition
        ...(isFinishLaunching ? {} : launchingScreens),
        ...authScreens,
        ...postLoginScreens,
        ...commonScreens,
      }).map(([name, component], index) => {
        const keyIdn = name + '-' + index;
        return (
          <Stack.Screen
            key={keyIdn}
            name={name}
            component={component}
            options={{
              headerShown: false,
              cardStyleInterpolator: getScreenCardStyleInterpolator(name),
              gestureEnabled: false,
            }}
          />
        );
      })}
    </Stack.Navigator>
  );
};