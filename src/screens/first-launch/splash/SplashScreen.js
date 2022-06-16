import React, { useEffect } from 'react';

import { useStoreState } from 'easy-peasy';
import i18n from 'i18n-js';
import { View, StyleSheet } from 'react-native';
import * as RNLocalize from 'react-native-localize';

import { AppIcon } from '~src/assets/images';
import { LANG_EN, LANG_TC, THEME_NAME } from '~src/constants/Constant';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import Route from '~src/navigations/Route';
import AppInitService from '~src/services/AppInitService';
import LinkingService from '~src/services/LinkingService';
import PushService from '~src/services/PushService';
import StorageService from '~src/services/StorageService';
import { sw } from '~src/styles/Mixins';
import CommonUtil from '~src/utils/CommonUtil';
import ErrorUtil from '~src/utils/ErrorUtil';

export default function SplashScreen({ navigation }) {
  const { locale, setLocale, t } = useLocalization();
  const { theme, setTheme } = useAppTheme();
  const styles = getStyle();

  const appState = useStoreState((state) => state.appState);

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

    if (isFirstLaunch) {
      navigation.navigate(Route.ONBOARDING_TUTORIAL_SCREEN, {});
    } else {
      navigation.navigate(Route.MAIN_STACK, { screen: Route.TAB_STACK });
    }
  };

  const loadData = async () => {
    console.log('SplashScreen -> loadData -> locale: ', locale);
    console.log('SplashScreen -> loadData -> i18n.locale: ', i18n.locale);
    await setDefaultLocale();
    await loadSavedAppValue();

    initAppData()
      .then(() => {
        console.log('SplashScreen -> initAppData -> success');
        setTimeout(() => {
          goNextPage();
        }, 3000);
      })
      .catch((error) => {
        ErrorUtil.showApiErrorMsgAlert(error, CommonUtil.exitApp);
        console.log('SplashScreen -> initAppData -> error: ', error);
      });
  };

  const initAppData = async () => {
    try {
      let checkAppDataResult = await AppInitService.checkAppUpdate();
      console.log(
        'SplashScreen -> initAppData -> checkAppDataResult: ',
        checkAppDataResult,
      );
      // let allDataResult = await DataUpdateService.getAllData();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
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
    // setTheme(AppDefaultTheme);

    let savedTheme = await StorageService.getTheme();
    let themeName = THEME_NAME.DEFAULT;
    console.log('SplashScreen -> loadTheme -> savedTheme : ', savedTheme);
    // console.log('SplashScreen -> loadTheme -> theme : ', theme);
    if (
      !savedTheme ||
      (savedTheme !== THEME_NAME.DEFAULT && savedTheme !== THEME_NAME.ZOOMED)
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
      <AppIcon />
    </View>
  );
}

const getStyle = () => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#17181E',
      alignItems: 'center',
      paddingTop: sw(200),
    },
  });
};
