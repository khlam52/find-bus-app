import React, { useEffect } from 'react';

import { StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppBackgroundView from '~src/components/AppBackgroundView';
import BackHeader from '~src/components/BackHeader';
import useAppContext from '~src/contexts/app';
import useAppTheme from '~src/contexts/theme';

export default function PDFModal({ navigation, route, ...props }) {
  const resourcesUri = route && route.params.uri ? route.params.uri : props.uri;

  const resourcesTitle =
    route && route.params.title
      ? route.params.title
      : props.title
      ? props.title
      : null;
  const insets = useSafeAreaInsets();

  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, { theme, themeName });

  const { showLoading, hideLoading } = useAppContext();
  useEffect(() => {
    if (resourcesUri) {
      showLoading();
    }
  }, []);

  return (
    <AppBackgroundView style={styles.container}>
      <BackHeader title={resourcesTitle} />
      <Pdf
        source={{ uri: resourcesUri }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(
            `PDFModal -> onLoadComplete -> Number of pages: ${numberOfPages}`,
          );
          hideLoading();
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`PDFModal -> onPageChanged -> Current page: ${page}`);
        }}
        onError={(error) => {
          console.log('PDFModal -> onError :', error);
          hideLoading();
        }}
        onPressLink={(uri) => {
          console.log(`PDFModal -> onPressLink -> Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </AppBackgroundView>
  );
}

const getStyle = (insets, { theme, themeName }) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    pdf: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });
};
