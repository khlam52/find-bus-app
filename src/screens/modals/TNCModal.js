import React, { useEffect, useRef, useState } from 'react';

import _ from 'lodash';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ArrowDownIcon,
  CheckIcon,
  UncheckIcon,
  CloseIcon,
} from '~src/assets/images';
import AppButton from '~src/components/AppButton';
import AppPressable from '~src/components/AppPressable';
import BaseHeader from '~src/components/BaseHeader';
import BottomSelectionMenu from '~src/components/BottomSelectionMenu';
import HTMLCodeView from '~src/components/HTMLCodeView';
import { LANG_EN, LANG_SC, LANG_TC } from '~src/constants/Constant';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import StorageService from '~src/services/StorageService';
import { Typography } from '~src/styles';
import { sh, sw } from '~src/styles/Mixins';
// route.params has
// 1. needChangeLang: control hide show change language button in header
// 2. needCancel: control hide show cancel button in header
// 3. tncItem: json for displaying
// 4. acceptTNCText: text for accepting tnc
// 5. cancelButtonHandler: handler for cancel button
// 6. title: title for the tnc
// 7. showBottomAccept: bottom accept tick
// 8. showCloseIcon: not using text, use icon

export default function TNCModal({ route, navigation }) {
  const { locale, setLocale, t, getField } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  const needChangeLang = route.params?.needChangeLang
    ? route.params?.needChangeLang
    : false;

  const needCancel = route.params?.needCancel
    ? route.params?.needCancel
    : false;
  const cancelTitle = route.params?.cancelTitle
    ? route.params?.cancelTitle
    : t('BUTTONS.CANCEL');

  const tncItem = route.params?.tncItem ? route.params?.tncItem : null;

  const approvedButtonHandler = route.params?.approvedButtonHandler
    ? route.params?.approvedButtonHandler
    : () => {};

  const acceptTNCText = route.params?.acceptTNCText
    ? route.params?.acceptTNCText
    : t('MODAL.TNC.ACCEPT_TNC');

  const acceptTNCSecondText = route.params?.acceptTNCSecondText
    ? route.params?.acceptTNCSecondText
    : null;

  const cancelButtonHandler = route.params?.cancelButtonHandler
    ? route.params?.cancelButtonHandler
    : navigation.goBack;

  const title = route.params?.title ? route.params?.title : null;

  const showCloseIcon = route.params?.showCloseIcon
    ? route.params?.showCloseIcon
    : false;

  const menuRef = useRef(null);
  const [selectedLang, setSelectedLang] = useState({});
  const [isCheckedText1, setIsCheckedText1] = useState(false);
  const [isCheckedText2, setIsCheckedText2] = useState(false);
  const [isShowAccept, setIsShowAccept] = useState(true);
  const customHtmlStyle = {
    p: {
      'font-family': 'Lato, sans-serif',
      'font-size': theme.fonts.size.para + 'px',
      'font-weight': '300',
    },
  };

  const getLang = () => {
    if (locale === LANG_TC) {
      return t('LANGUAGE_CHANGE_MENU.TC');
    } else if (locale === LANG_SC) {
      return t('LANGUAGE_CHANGE_MENU.TC');
    } else {
      return t('LANGUAGE_CHANGE_MENU.EN');
    }
  };

  const LANG_ARRAY = useRef([
    {
      locale: 'en',
      nameEnUS: t('SCREENS.LANGUAGE_SETTING_SCREEN.ENG'),
      nameZhCN: t('SCREENS.LANGUAGE_SETTING_SCREEN.ENG'),
      nameZhHK: t('SCREENS.LANGUAGE_SETTING_SCREEN.ENG'),
    },
    {
      locale: 'zh-Hant',
      nameEnUS: t('SCREENS.LANGUAGE_SETTING_SCREEN.TC'),
      nameZhCN: t('SCREENS.LANGUAGE_SETTING_SCREEN.TC'),
      nameZhHK: t('SCREENS.LANGUAGE_SETTING_SCREEN.TC'),
    },
    {
      locale: 'zh-Hans',
      nameEnUS: t('SCREENS.LANGUAGE_SETTING_SCREEN.SC'),
      nameZhCN: t('SCREENS.LANGUAGE_SETTING_SCREEN.SC'),
      nameZhHK: t('SCREENS.LANGUAGE_SETTING_SCREEN.SC'),
    },
  ]);

  useEffect(() => {
    console.log('TNCModal -> useEffect');
    LANG_ARRAY.current.forEach((item) => {
      if (item.locale === locale) {
        setSelectedLang(item);
      }
    });
    setIsShowAccept(_.get(route, 'params.showBottomAccept', true));
  }, []);

  useEffect(() => {
    console.log('TNCModal -> setSelectedLang');
    LANG_ARRAY.current.forEach((item) => {
      if (item.locale === locale) {
        setSelectedLang(item);
      }
    });
    return () => {};
  }, [locale]);

  const onLangButtonPressed = () => {
    if (menuRef && menuRef.current) {
      menuRef.current.open();
    }
  };

  const onSelectLangItem = (langObj) => {
    if (langObj) {
      setLocale(langObj.locale);
    }

    if (menuRef && menuRef.current) {
      menuRef.current.close();
    }
  };

  const onCheckButtonPressedText1 = () => {
    setIsCheckedText1(!isCheckedText1);
  };

  const onCheckButtonPressedText2 = () => {
    setIsCheckedText2(!isCheckedText2);
  };

  const onApprovedButtonPressed = async () => {
    if (isCheckedText1 && isCheckedText2) {
      await StorageService.setIsViewedTNC(true);
    }
    navigation.goBack();
    approvedButtonHandler();
  };

  const renderBottomView = () => {
    return (
      <View style={styles.bottomView}>
        <AppPressable
          onPress={onCheckButtonPressedText1}
          disableDelayPress={true}>
          <View style={styles.acceptFirstTextView}>
            {isCheckedText1 ? (
              <CheckIcon width={sw(18)} height={sw(18)} />
            ) : (
              <UncheckIcon width={sw(18)} height={sw(18)} />
            )}
            <Text style={styles.acceptText}>{acceptTNCText}</Text>
          </View>
        </AppPressable>
        {acceptTNCSecondText ? (
          <AppPressable
            onPress={onCheckButtonPressedText2}
            disableDelayPress={true}>
            <View style={styles.acceptSecondTextView}>
              {isCheckedText2 ? (
                <CheckIcon width={sw(18)} height={sw(18)} />
              ) : (
                <UncheckIcon width={sw(18)} height={sw(18)} />
              )}
              <Text style={styles.acceptText}>{acceptTNCSecondText}</Text>
            </View>
          </AppPressable>
        ) : null}

        {/* <AppButton
          disabled={!isCheckedText1 || !isCheckedText2}
          onPress={onApprovedButtonPressed}
          text={t('BUTTONS.CONFIRM')}
        /> */}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BaseHeader
        leftElement={
          needChangeLang ? (
            <AppPressable
              onPress={onLangButtonPressed}
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.languageLabel}>{getLang()}</Text>
              <ArrowDownIcon fill={theme.colors.text} />
            </AppPressable>
          ) : null
        }
        title={''}
        rightElement={
          needCancel ? (
            showCloseIcon ? (
              <AppPressable onPress={cancelButtonHandler}>
                <CloseIcon
                  width={sw(16)}
                  height={sw(16)}
                  fill={theme.colors.text60}
                />
              </AppPressable>
            ) : (
              <AppPressable onPress={cancelButtonHandler}>
                <Text style={styles.cancelButtonText}>{cancelTitle}</Text>
              </AppPressable>
            )
          ) : null
        }
        isTransparent={true}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {title && <Text style={styles.titleText}>{title}</Text>}
          <HTMLCodeView
            htmlBodyCode={
              locale === LANG_EN
                ? tncItem.contentEnUS
                : locale === LANG_SC
                ? tncItem.contentZhCN
                : tncItem.contentZhHK
            }
            forwardCustomHtmlStyle={customHtmlStyle}
            scrollEnabled={false}
          />
          {isShowAccept ? renderBottomView() : null}
        </ScrollView>
        {isShowAccept ? (
          <View style={{ margin: sw(24) }}>
            <AppButton
              disabled={
                acceptTNCSecondText
                  ? !isCheckedText1 || !isCheckedText2
                  : !isCheckedText1
              }
              onPress={onApprovedButtonPressed}
              text={t('BUTTONS.CONFIRM')}
            />
          </View>
        ) : null}
      </SafeAreaView>

      <BottomSelectionMenu
        key={'pageBottomSheet'}
        title={t('SCREENS.LANGUAGE_SETTING_SCREEN.LANGUAGE')}
        menuRef={menuRef}
        selectedItem={selectedLang}
        menuList={LANG_ARRAY.current}
        onSelectMenuItem={onSelectLangItem}
      />
    </View>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.underlayerLt,
    },
    languageLabel: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.lead),
      color: theme.colors.text,
      marginRight: sw(theme.spacings.s1),
    },
    cancelButtonText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.lead),
      color: theme.colors.supportive,
    },
    scrollView: { flex: 1, paddingHorizontal: sw(theme.spacings.s3) },
    titleText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.h2),
      color: theme.colors.text950,
    },
    contentText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.lead),
      color: theme.colors.text,
      marginTop: sh(24),
    },
    bottomView: {
      paddingBottom: sh(24),
    },
    acceptFirstTextView: {
      flexDirection: 'row',
      marginTop: sw(28),
      alignItems: 'center',
    },
    acceptSecondTextView: {
      flexDirection: 'row',
      marginTop: sw(16),
      marginBottom: sw(41),
      alignItems: 'center',
    },
    acceptText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.para),
      color: theme.colors.text,
      marginLeft: sw(17),
      marginRight: sw(theme.spacings.s3),
    },
  });
};
