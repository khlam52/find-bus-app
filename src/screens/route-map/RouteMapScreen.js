import React from 'react';

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackIcon } from '~src/assets/images';
import BaseHeader from '~src/components/BaseHeader';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';

export default function RouteMapScreen({ navigation }) {
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  return (
    <View style={styles.container}>
      <BaseHeader
        title={'Bus No. To Station B'}
        leftElement={
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <BackIcon fill={theme.colors.text} />
          </Pressable>
        }
      />
      <Text>test screen</Text>
    </View>
  );
}

const getStyle = (insets) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
  });
};
