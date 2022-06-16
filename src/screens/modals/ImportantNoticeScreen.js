import React, { useEffect, useState } from 'react';

import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackHeader from '~src/components/BackHeader';
import HTMLCodeView from '~src/components/HTMLCodeView';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { DataUpdateService } from '~src/services/DataUpdateService';
import { Typography } from '~src/styles';
import { sh, sw } from '~src/styles/Mixins';
/* Lorem ipsum dolor si */

export default function ImportantNoticeScreen({ navigation }) {
  const { t, locale, getField } = useLocalization();
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = getStyle(insets, theme);
  const [importantNoticeArr, setImportantNoticeArr] = useState([]);
  const customHtmlStyle = {
    p: {
      'font-family': 'Lato, sans-serif',
      'font-size': theme.fonts.size.para + 'px',
      'font-weight': '300',
    },
  };

  useEffect(() => {
    console.log('ImportantNoticeScreen -> useEffect ');
    importantNoticeInit();
  }, []);

  const importantNoticeInit = async () => {
    console.log('ImportantNoticeScreen -> importantNoticeInit ');
    let importantNoticeResponse = await DataUpdateService.getImportantNotice();
    console.log(
      'ImportantNoticeScreen -> importantNoticeResponse ',
      importantNoticeResponse,
    );
    setImportantNoticeArr(importantNoticeResponse.importantNoticeList);
  };

  const renderItemView = ({ index, item }) => {
    return (
      <View style={index === 0 ? styles.firstItem : styles.item} key={index}>
        <Text style={styles.itemTitleText}>{getField(item, 'subject')}</Text>
        <HTMLCodeView
          htmlBodyCode={getField(item, 'body')}
          forwardCustomHtmlStyle={customHtmlStyle}
          scrollEnabled={false}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader title={t('SCREENS.IMPORTANT_NOTICE_SCREEN.TITLE')} />
      <FlatList
        data={importantNoticeArr}
        renderItem={renderItemView}
        keyExtractor={(item, index) => {
          return 'ImportantNoticeRowItem' + index.toString();
        }}
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

    firstItem: {
      marginHorizontal: sw(theme.spacings.s3),
      marginTop: sh(theme.spacings.s4),
    },

    item: {
      marginHorizontal: sw(theme.spacings.s3),
      marginVertical: sh(theme.spacings.s2),
    },
    itemTitleText: {
      //   marginLeft: sw(theme.spacings.s2),
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.h4),
      color: theme.colors.text,
    },
  });
};
