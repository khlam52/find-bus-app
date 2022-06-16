/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';

import { useStoreActions, useStoreState } from 'easy-peasy';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BackHeader from '~src/components/BackHeader';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { sw } from '~src/styles/Mixins';

export default function FindBusScreen({ navigation }) {
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading, setIsFinishLaunching } = useAppContext();

  const menuRef = useRef(null);

  const [selectedLang, setSelectedLang] = useState({});

  const insets = useSafeAreaInsets();
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  const appState = useStoreState((state) => state.appState);
  const setIsFirstOpen = useStoreActions(
    (actions) => actions.appState.setIsFirstOpen,
  );

  useEffect(() => {
    // showLoading();
  }, []);

  return (
    <View style={styles.container}>
      <BackHeader
        leftElement={null}
        isTransparent={true}
        title={'Find Your Bus'}
      />
      <Text>FindBusScreen</Text>
    </View>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#26262C',
    },
    buttonContainer: {
      marginHorizontal: sw(theme.spacings.s3),
    },
  });
};
