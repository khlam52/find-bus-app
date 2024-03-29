import React, { useEffect } from 'react';

import { useStoreActions, useStoreState } from 'easy-peasy';
import i18n from 'i18n-js';
import { View, StyleSheet, Text, ActivityIndicator, Alert } from 'react-native';
import * as RNLocalize from 'react-native-localize';

import { AppIcon } from '~src/assets/images';
import { LANG_EN, LANG_TC, THEME_NAME } from '~src/constants/Constant';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import Route from '~src/navigations/Route';
import ApiService from '~src/services/ApiService';
import LinkingService from '~src/services/LinkingService';
import PushService from '~src/services/PushService';
import StorageService from '~src/services/StorageService';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';
import { FONT_FAMILY_400 } from '~src/styles/Typography';
import CommonUtil from '~src/utils/CommonUtil';

export default function SplashScreen({ navigation }) {
  const { locale, setLocale, t } = useLocalization();
  const { theme, setTheme } = useAppTheme();
  const styles = getStyle(theme);

  const appState = useStoreState((state) => state.appState);

  const setAllBusRouteList = useStoreActions(
    (action) => action.user.setAllBusRouteList,
  );

  const setFavouriteList = useStoreActions(
    (action) => action.user.setFavouriteList,
  );

  const setAllStopDetailList = useStoreActions(
    (action) => action.user.setAllStopDetailList,
  );

  useEffect(() => {
    console.log('SplashScreen -> useEffect');

    if (appState.isFirstOpen) {
      PushService.register();
      LinkingService.init();
      loadData();
    }
    loadTheme();
  }, []);

  const goNextPage = async () => {
    let isTncRead = await StorageService.getIsViewedTNC();
    let isFirstLaunch = await StorageService.getIsFirstLaunch();

    console.log('isTncRead:', isTncRead);
    console.log('isFirstLaunch:', isFirstLaunch);

    navigation.navigate(Route.MAIN_STACK, { screen: Route.TAB_STACK });
  };

  const loadData = async () => {
    console.log('SplashScreen -> loadData -> locale: ', locale);
    console.log('SplashScreen -> loadData -> i18n.locale: ', i18n.locale);
    await setDefaultLocale();
    await loadSavedAppValue();

    let favouriteList = await StorageService.getFavouriteList();
    setFavouriteList(favouriteList);

    setTimeout(() => {
      goNextPage();
    }, 1000);

    initAppData()
      .then(() => {
        console.log('SplashScreen -> initAppData -> success');
        setTimeout(() => {
          goNextPage();
        }, 3000);
      })
      .catch((error) => {
        Alert.alert(
          i18n.t('SCREENS.SPLASH_SCREEN.ERROR'),
          null,
          [
            {
              text: i18n.t('BUTTONS.OK'),
              onPress: () => CommonUtil.exitApp(),
              style: 'cancel',
            },
          ],
          null,
        );
        console.log('SplashScreen -> initAppData -> error: ', error);
      });
  };

  const initAppData = async () => {
    try {
      let response = await ApiService.getKMBAllRouteList();
      console.log('getKMBAllRouteList response:', response);
      if (response.data) {
        setAllBusRouteList(response.data);
      }
    } catch (error) {
      console.log('getKMBAllRouteList error ->', error);
    }

    try {
      let response = await ApiService.getKMBStopLatLongDetail('');
      console.log('getKMBStopLatLongDetail response:', response);
      if (response.data) {
        setAllStopDetailList(response.data);
      }
    } catch (error) {
      console.log('getKMBAllRouteList error ->', error);
    }
  };

  const setDefaultLocale = async () => {
    // first time open app, load value from device os lang
    let savedLocale = await StorageService.getLocale();
    if (savedLocale) {
      if (savedLocale) {
        console.log(
          'SplashScreen -> setDefaultLanguage -> not first launch -> savedLocale:',
          savedLocale,
        );
        setLocale(savedLocale);
        return savedLocale;
      }
    } else {
      const deviceLocales = RNLocalize.getLocales();
      console.log(
        'SplashScreen -> setDefaultLocale -> first launch -> RNLocalize.getLocales:',
        deviceLocales,
      );
      if (Array.isArray(deviceLocales)) {
        let languageTag = deviceLocales[0].languageTag;
        let defaultLocale = LANG_EN;
        if (
          languageTag.indexOf('zh-HK') !== -1 ||
          languageTag.indexOf('zh-MO') !== -1 ||
          languageTag.indexOf('zh-TW') !== -1 ||
          languageTag.indexOf('zh-Hant') !== -1 ||
          languageTag.indexOf('zh-CN') !== -1 ||
          languageTag.indexOf('zh-Hans') !== -1
        ) {
          defaultLocale = LANG_TC;
        }

        setLocale(defaultLocale);
        return defaultLocale;
      }
    }
  };

  const loadTheme = async () => {
    console.log('SplashScreen -> loadTheme !!');
    // setTheme(AppDarkTheme);

    let savedTheme = await StorageService.getTheme();
    let themeName = THEME_NAME.DARK;
    console.log('SplashScreen -> loadTheme -> savedTheme : ', savedTheme);
    // console.log('SplashScreen -> loadTheme -> theme : ', theme);
    if (
      !savedTheme ||
      (savedTheme !== THEME_NAME.DARK && savedTheme !== THEME_NAME.LIGHT)
    ) {
      StorageService.setTheme(themeName).then((pl) => {
        console.log(
          'SplashScreen -> loadTheme -> StorageService.setTheme : ',
          pl,
        );
      });
    } else {
      themeName = savedTheme;
    }
    if (!theme || !theme.name || themeName !== theme.name) {
      setTheme(themeName);
    }
  };

  const loadSavedAppValue = async () => {};

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <AppIcon />
      </View>
      <ActivityIndicator />
      <Text style={styles.dataText}>{t('SCREENS.SPLASH_SCREEN.TITLE')}</Text>
    </View>
  );
}

const getStyle = (theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#17181E',
      alignItems: 'center',
      paddingTop: sw(200),
    },
    dataText: {
      ...Typography.ts(FONT_FAMILY_400, sw(14)),
      paddingBottom: sw(36),
      paddingTop: sw(20),
      color: '#B6B6B6',
    },
  });
};
