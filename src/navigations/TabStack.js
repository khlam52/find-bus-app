import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Route from './Route';
import { AppIcon } from '~src/assets/images';
import useLocalization from '~src/contexts/i18n';
import FavouriteScreen from '~src/screens/favourite/FavouriteScreen';
import FindBusScreen from '~src/screens/find-bus/FindBusScreen';
import SearchScreen from '~src/screens/search/SearchScreen';
import { Colors } from '~src/styles';
import { sw } from '~src/styles/Mixins';

const Tab = createBottomTabNavigator();

export const TabStack = (props) => {
  const insets = useSafeAreaInsets();
  const { locale, t } = useLocalization();

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Tab.Navigator
        initialRouteName={Route.FIND_BUS_SCREEN}
        backBehavior="initialRoute"
        shifting={false}
        tabBarVisible={false}
        // tabBar={(props) => <TabBar {...props} />}
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tarBarHideKeyboard: true,
        }}
        tabBarOptions={{
          activeTintColor: Colors.COLOR_40,
          inactiveTintColor: Colors.COLOR_33,
          style: {
            height: insets.bottom + 70,
            borderTopRightRadius: 28,
            borderTopLeftRadius: 28,
            shadowOpacity: 0.1,
            shadowRadius: 4.0,
            backgroundColor: 'white',
          },
          // iconStyle: { marginBottom: -10 },
        }}>
        <Tab.Screen
          name={Route.SEARCH_SCREEN}
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <AppIcon width={sw(36)} height={sw(36)} fill={color} />
              ) : (
                <AppIcon width={sw(36)} height={sw(36)} fill={color} />
              ),
          }}
          listeners={() => ({
            tabPress: (event) => {},
          })}
        />
        <Tab.Screen
          name={Route.FIND_BUS_SCREEN}
          component={FindBusScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <AppIcon width={sw(36)} height={sw(36)} fill={color} />
              ) : (
                <AppIcon width={sw(36)} height={sw(36)} fill={color} />
              ),
          }}
          listeners={() => ({
            tabPress: (event) => {},
          })}
        />
        <Tab.Screen
          name={Route.FAVOURITE_SCREEN}
          component={FavouriteScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <AppIcon width={sw(36)} height={sw(36)} fill={color} />
              ) : (
                <AppIcon width={sw(36)} height={sw(36)} fill={color} />
              ),
          }}
          listeners={() => ({
            tabPress: (event) => {},
          })}
        />
      </Tab.Navigator>
    </View>
  );
};
