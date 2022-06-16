import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Route from './Route';
import { TabHeartIcon, TabHomeIcon, TabSearchIcon } from '~src/assets/images';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import FavouriteScreen from '~src/screens/favourite/FavouriteScreen';
import FindBusScreen from '~src/screens/find-bus/FindBusScreen';
import SearchScreen from '~src/screens/search/SearchScreen';
import { sw } from '~src/styles/Mixins';

const Tab = createBottomTabNavigator();

export const TabStack = (props) => {
  const insets = useSafeAreaInsets();
  const { locale, t } = useLocalization();
  const {
    themeSwitched: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  const getTabIconStyle = (focused, tabNum) => {
    let icon;
    switch (tabNum) {
      case 1:
        icon = <TabSearchIcon fill={focused ? '#C5F1FE' : '#2E4052'} />;
        break;
      case 2:
        icon = <TabHomeIcon fill={focused ? '#C5F1FE' : '#2E4052'} />;
        break;
      case 3:
        icon = <TabHeartIcon fill={focused ? '#C5F1FE' : '#2E4052'} />;
        break;
    }

    return (
      <View style={styles.iconView}>
        {icon}
        {focused && <View style={styles.iconUnderline} />}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Tab.Navigator
        initialRouteName={Route.FIND_BUS_SCREEN}
        backBehavior="initialRoute"
        shifting={false}
        tabBarVisible={false}
        // tabBar={(props) => <TabBar {...props} />}
        tabBarOptions={{
          activeTintColor: theme.colors.primary,
          inactiveTintColor: '#6A7991',
          tabBarStyle: styles.tabView,

          // labelStyle: labelStyle,
          // iconStyle: { marginBottom: -10 },
          // tabStyle: styles.tabBarItemStyle,
        }}
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tarBarHideKeyboard: true,
          tabBarStyle: styles.tabView,
        }}>
        <Tab.Screen
          name={Route.SEARCH_SCREEN}
          component={SearchScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return getTabIconStyle(focused, 1);
            },
          }}
          listeners={() => ({
            tabPress: (event) => {},
          })}
        />
        <Tab.Screen
          name={Route.FIND_BUS_SCREEN}
          component={FindBusScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return getTabIconStyle(focused, 2);
            },
          }}
          listeners={() => ({
            tabPress: (event) => {},
          })}
        />
        <Tab.Screen
          name={Route.FAVOURITE_SCREEN}
          component={FavouriteScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return getTabIconStyle(focused, 3);
            },
          }}
          listeners={() => ({
            tabPress: (event) => {},
          })}
        />
      </Tab.Navigator>
    </View>
  );
};

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    tabView: {
      position: 'absolute',
      height:
        insets.bottom > 0
          ? insets.bottom + sw(70)
          : sw(theme.spacings.s2) + sw(70),
      borderTopRightRadius: sw(20),
      borderTopLeftRadius: sw(20),
      shadowOpacity: 0.8,
      shadowRadius: 10.0,
      shadowOffset: { 0: 15 },
      backgroundColor: '#17181E',
      borderTopWidth: 0,
      elevation: 50,
    },
    iconView: {
      alignItems: 'center',
    },
    iconUnderline: {
      width: sw(36),
      height: sw(3),
      backgroundColor: '#C5F1FE',
      borderRadius: sw(100),
      marginTop: sw(8),
    },
  });
};