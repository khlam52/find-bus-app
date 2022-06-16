import React from 'react';

import { StyleSheet, SafeAreaView, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppBackgroundView from '~src/components/AppBackgroundView';
import BackHeader from '~src/components/BackHeader';
import HTMLCodeView from '~src/components/HTMLCodeView';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';

export default function HtmlCodeViewModal({ navigation, route, ...props }) {
  const forwardedHtmlBodyCode =
    route && route.params.htmlBodyCode ? route.params.htmlBodyCode : null;
  const forwardCustomHtmlStyle =
    route && route.params.forwardCustomHtmlStyle
      ? route.params.forwardCustomHtmlStyle
      : customHtmlStyle;
  const title = route.params?.title ? route.params?.title : null;

  const {
    theme: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  const customHtmlStyle = {
    p: {
      'font-family': 'Lato, sans-serif',
      'font-size': theme.fonts.size.para + 'px',
      'font-weight': '300',
    },
    ol: {
      'font-family': 'Lato, sans-serif',
      'font-size': theme.fonts.size.para + 'px',
      'font-weight': '300',
    },
  };

  const insets = useSafeAreaInsets();

  console.log('HtmlCodeViewModal -> navigation -> ', navigation);
  if (route && route.params) {
    console.log('HtmlCodeViewModal -> route -> ', route);
    console.log('HtmlCodeViewModal -> route.params -> ', route.params);
  } else {
    console.log('HtmlCodeViewModal -> route -> [Error] -> Empty route ');
  }

  return (
    <AppBackgroundView style={styles.container}>
      <BackHeader isTransparent={true} />
      <SafeAreaView style={styles.safeAreaView}>
        <ScrollView style={styles.scrollView}>
          {title && <Text style={styles.titleText}>{title}</Text>}
          {forwardedHtmlBodyCode && (
            <HTMLCodeView
              htmlBodyCode={forwardedHtmlBodyCode}
              forwardCustomHtmlStyle={customHtmlStyle}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </AppBackgroundView>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.underlayerLt,
    },
    scrollView: {
      flex: 1,
      paddingHorizontal: sw(theme.spacings.s3),
    },
    safeAreaView: {
      flex: 1,
    },
    titleText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.h2),
      color: theme.colors.text950,
    },
  });
};
