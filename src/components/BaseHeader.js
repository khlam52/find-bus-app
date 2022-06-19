import React, { useEffect, useRef, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  NativeModules,
  Platform,
} from 'react-native';

import AppFocusAwareStatusBar from './AppFocusAwareStatusBar';
import AppPressable from './AppPressable';
import { DarkThemeIcon, EarthIcon, LightThemeIcon } from '~src/assets/images';
import { THEME_NAME } from '~src/constants/Constant';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import AppColorPalette from '~src/contexts/theme/AppColorPalette';
import { withAllContext } from '~src/contexts/withAllContext';
import RootNavigation from '~src/navigations/RootNavigation';
import Route from '~src/navigations/Route';
import StorageService from '~src/services/StorageService';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';
import CommonUtil from '~src/utils/CommonUtil';

const BaseHeader = ({
  title,
  titleContainerStyle,
  leftElement,
  leftElementContainerStyle,
  rightElementContainerStyle,
  additionalStyle,
  isShowChangeLang,
  ...props
}) => {
  const {
    theme: { settings: theme },
    themeSwitched: { name: themeName },
    setTheme,
  } = useAppTheme();
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const styles = getStyle(theme, themeName, { ...props });

  const [selectedLang, setSelectedLang] = useState({});

  const LANG_ARRAY = useRef([
    {
      locale: 'en',
      name: 'English',
    },
    {
      locale: 'zh-Hant',
      name: '中文',
    },
  ]);

  useEffect(() => {
    console.log('setSelectedLang');
    LANG_ARRAY.current.forEach((item) => {
      if (item.locale === locale) {
        setSelectedLang(item);
      }
    });
    return () => {};
  }, [locale]);

  const onEarthIconPressed = () => {
    RootNavigation.navigate(Route.BOTTOM_SHEET_SELECTION_MODAL, {
      selectedCallback: onSelectLangItem,
      selectedItem: selectedLang,
      selectionListArray: LANG_ARRAY.current,
      title: t('MODAL.SELECT_LANGUAGE.TITLE'),
    });
  };

  const onSelectLangItem = (langObj) => {
    setLocale(langObj.locale);
    setSelectedLang(langObj);
  };

  // Theme Color Func
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const getBackgroundThemeColor = () => {
    return props.backgroundColor
      ? props.backgroundColor
      : themeName !== THEME_NAME.LIGHT
      ? AppColorPalette.blue.background
      : AppColorPalette.grey.text;
  };

  const getEarthIconThemeColor = () => {
    return themeName !== THEME_NAME.LIGHT
      ? AppColorPalette.blue.secondary
      : AppColorPalette.blue.secondaryLight;
  };
  ////

  useFocusEffect(
    React.useCallback(() => {
      console.log('isDarkTheme:', isDarkTheme);
      checkThemeSelection();
      return () => {};
    }, []),
  );

  // Theme Setting
  const checkThemeSelection = async () => {
    let savedTheme = await StorageService.getTheme();
    let intThemeName =
      !savedTheme ||
      savedTheme === undefined ||
      savedTheme === null ||
      (savedTheme !== THEME_NAME.DARK && savedTheme !== THEME_NAME.LIGHT)
        ? THEME_NAME.DARK
        : savedTheme;
    console.log('savedTheme:', savedTheme);
    console.log('intThemeName:', intThemeName);
    if (
      (intThemeName === THEME_NAME.LIGHT && !isDarkTheme) ||
      (intThemeName !== THEME_NAME.LIGHT && isDarkTheme)
    )
      setIsDarkTheme(intThemeName === THEME_NAME.LIGHT);
    if (
      (intThemeName === THEME_NAME.LIGHT && themeName !== THEME_NAME.LIGHT) ||
      (intThemeName !== THEME_NAME.LIGHT && themeName === THEME_NAME.LIGHT)
    )
      setTheme(intThemeName);
  };

  const setThemeSelection = async (_themeName) => {
    StorageService.setTheme(_themeName).then((pl) => {
      console.log(
        'SettingScreen -> setTheme -> StorageService.setTheme : ',
        pl,
      );
    });
    hideLoading();
    setTheme(_themeName);
  };

  const onThemeIconPressed = () => {
    showLoading();
    setIsDarkTheme((previousState) => {
      setThemeSelection(
        previousState === true ? THEME_NAME.DARK : THEME_NAME.LIGHT,
      );
      return !previousState;
    });
  };
  ////

  return (
    <View
      onLayout={props.onLayoutEvent !== undefined ? props.onLayoutEvent : null}>
      <AppFocusAwareStatusBar
        barStyle={
          CommonUtil.getColorBrightness(getBackgroundThemeColor()) > 150
            ? 'dark-content'
            : 'light-content'
        }
        backgroundColor={getBackgroundThemeColor()}
        animated={false}
      />
      <SafeAreaView
        style={{
          backgroundColor: getBackgroundThemeColor(),
        }}>
        <View
          style={{
            ...styles.container,
            ...(additionalStyle !== undefined ? additionalStyle : null),
          }}>
          <View
            style={[
              styles.sideElementContainer,
              styles.sideLeft,
              leftElementContainerStyle ? leftElementContainerStyle : null,
            ]}>
            {leftElement ? (
              leftElement
            ) : (
              <AppPressable
                onPress={onThemeIconPressed}
                disableDelayPress={true}>
                <View>
                  {themeName !== THEME_NAME.LIGHT ? (
                    <DarkThemeIcon />
                  ) : (
                    <LightThemeIcon />
                  )}
                </View>
              </AppPressable>
            )}
          </View>
          <View
            style={{
              ...styles.titleContainer,
              ...(titleContainerStyle ? titleContainerStyle : null),
            }}>
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={props.secondTitle ? 1 : 2}
              ellipsizeMode={'tail'}
              style={styles.titleText}>
              {title ? title : ''}
            </Text>
          </View>

          <View
            style={[
              styles.sideElementContainer,
              styles.sideRight,
              rightElementContainerStyle ? rightElementContainerStyle : null,
            ]}>
            {isShowChangeLang && (
              <AppPressable onPress={onEarthIconPressed}>
                <View>
                  <EarthIcon fill={getEarthIconThemeColor()} />
                </View>
              </AppPressable>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
const getStyle = (theme, themeName, props) => {
  const { StatusBarManager } = NativeModules;
  return StyleSheet.create({
    safeArea: {},
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: sw(12),
      paddingBottom: sw(18),
      ...(!props.isTransparent && Platform.OS === 'android'
        ? { marginTop: StatusBarManager.HEIGHT }
        : null),
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: sw(16),
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.para),
      textAlign: 'center',
      color:
        themeName !== THEME_NAME.LIGHT
          ? AppColorPalette.grey.text
          : AppColorPalette.blue.primary,
    },
    subTitleText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.desc),
      textAlign: 'center',
    },
    sideElementContainer: {
      minWidth: sw(theme.spacings.s5),
    },
    sideLeft: {
      marginLeft: sw(28),
      alignItems: 'flex-start',
    },
    sideRight: {
      marginRight: sw(28),
      alignItems: 'flex-end',
    },
  });
};

export default withAllContext(BaseHeader);
