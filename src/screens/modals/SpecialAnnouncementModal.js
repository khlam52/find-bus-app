import React, { useEffect, useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CheckIcon,
  UncheckIcon,
  CriticalMessageIcon,
} from '~src/assets/images';
import AppButton from '~src/components/AppButton';
import AppPressable from '~src/components/AppPressable';
import HTMLCodeView from '~src/components/HTMLCodeView';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { DataUpdateService } from '~src/services/DataUpdateService';
import StorageService from '~src/services/StorageService';
import { Typography } from '~src/styles';
import { sh, sw } from '~src/styles/Mixins';
export default function SpecialAnnouncementModal({ route, navigation }) {
  const { locale, setLocale, t, getField } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  const [isChecked, setIsChecked] = useState(false);
  const [criticalNotice, setCriticalNotice] = useState({});

  useEffect(() => {
    console.log('SpecialAnnouncementModal -> useEffect');
    initData();
  }, []);

  const initData = async () => {
    let criticalNoticeResponse = await DataUpdateService.getCriticalNotice();
    console.log(
      'SpecialAnnouncementModal -> criticalNoticeResponse:',
      criticalNoticeResponse,
    );
    setCriticalNotice(criticalNoticeResponse);
  };

  const onCloseButtonPressed = async () => {
    if (isChecked) {
      await StorageService.setIsViewedCriticalNotice(true);
    }
    navigation.goBack();
  };

  const onCheckButtonPressed = () => {
    setIsChecked(!isChecked);
  };

  const renderIcon = () => {
    return (
      <View style={styles.iconContainer}>
        <CriticalMessageIcon width={sw(60)} height={sw(69)} />
      </View>
    );
  };
  const renderTitle = () => {
    let title = '';
    if (criticalNotice) {
      title = getField(criticalNotice, 'subject');
    }
    return <Text style={styles.titleText}>{title}</Text>;
  };

  const customHtmlStyle = {
    'font-family': 'Lato, sans-serif',
    'font-size': theme.fonts.size.para + 'px',
    body: { height: '110%' },
  };

  const renderBody = () => {
    if (!criticalNotice) return;
    return (
      <HTMLCodeView
        bodyViewStyle={styles.bodyView}
        htmlBodyCode={getField(criticalNotice, 'body')}
        forwardCustomHtmlStyle={customHtmlStyle}
      />
    );
  };

  const renderBottomView = () => {
    return (
      <View style={styles.bottomView}>
        <AppPressable onPress={onCheckButtonPressed}>
          <View style={styles.dontShowView}>
            {isChecked ? (
              <CheckIcon width={sw(20)} height={sw(20)} />
            ) : (
              <UncheckIcon width={sw(20)} height={sw(20)} />
            )}
            <Text style={styles.dontShowText}>
              {t('MODAL.SPECIAL_ANNOUNCEMENT.DONT_SHOW_AGAIN')}
            </Text>
          </View>
        </AppPressable>

        <AppButton onPress={onCloseButtonPressed} text={t('BUTTONS.CLOSE')} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {renderIcon()}
        {renderTitle()}
        {renderBody()}
        {renderBottomView()}
      </View>
    </View>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    contentContainer: {
      flex: 1,
      marginHorizontal: sw(theme.spacings.s3),
      marginVertical: sh(64),
      backgroundColor: theme.colors.background,
      borderRadius: sw(theme.roundness.container),
      alignItems: 'center',
      paddingVertical: sh(24),
    },
    iconContainer: { marginBottom: sh(20) },
    titleText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.h4),
      color: theme.colors.text,
      marginBottom: sh(16),
    },
    bodyView: {
      flex: 1,
      width: '100%',
      marginBottom: sh(16),
    },
    webView: { backgroundColor: 'transparent' },
    bottomView: { width: '100%', paddingHorizontal: sw(theme.spacings.s2) },
    dontShowView: {
      flexDirection: 'row',
      marginBottom: sh(41),
      alignItems: 'center',
      marginLeft: sw(28),
    },
    dontShowText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.para),
      color: theme.colors.text,
      marginLeft: sw(17),
    },
  });
};
