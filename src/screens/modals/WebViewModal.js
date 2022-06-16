import React from 'react';

import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import BackHeader from '~src/components/BackHeader';
import Loader from '~src/components/Loader';
import useAppTheme from '~src/contexts/theme';
import { sw, sh } from '~src/styles/Mixins';
import ErrorUtil from '~src/utils/ErrorUtil';

export default function WebViewModal({ navigation, route, ...props }) {
  const resourcesUri = route && route.params.uri ? route.params.uri : props.uri;
  const insets = useSafeAreaInsets();
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);
  const js = 'setTimeout(function(){ window.scrollTo(0, 0); }, 1000);';

  const navigationStateChange = (url) => {
    console.log('WebViewModal -> navigationStateChange url:', url);
  };

  const onError = (e) => {
    console.log('WebViewModal -> onError -> error');
    console.log(e);
    ErrorUtil.showInternalNotConnectError(navigation.goBack);
    return <Loader isLoaderShow={false} />;
  };

  return (
    <View style={styles.container}>
      <BackHeader isTransparent={true} />

      <SafeAreaView style={styles.container}>
        <WebView
          source={{ uri: resourcesUri }}
          javaScriptEnabled={true}
          injectedJavaScript={js}
          onMessage={() => {}}
          startInLoadingState={true}
          renderLoading={() => <Loader isLoaderShow={true} />}
          onLoadEnd={() => <Loader isLoaderShow={false} />}
          onError={onError}
          onNavigationStateChange={navigationStateChange}
        />
      </SafeAreaView>
    </View>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.underlayerLt,
    },
    backButtonContainer: {
      marginLeft: insets.left + sw(30),
      marginBottom: sh(10),
    },
  });
};
