import React, { useEffect } from 'react';

import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackIcon } from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import BaseHeader from '~src/components/BaseHeader';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';

export default function TemplateScreen({ route, navigation }) {
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  // get navigation params if any
  // const { itemId, otherParam } = route.params;

  useEffect(() => {
    console.log('TemplateScreen -> useEffect');
  }, []);

  const onButtonPressed = () => {};

  return (
    <View style={styles.container}>
      <BaseHeader
        title={t('SCREENS.TAB1_SCREEN.TITLE')}
        leftElement={
          <AppPressable onPress={navigation.goBack}>
            <BackIcon stroke={'#FFFFFF'} fill={'#FFFFFF'} />
          </AppPressable>
        }
      />
      <SafeAreaView style={styles.container}>
        <AppPressable onPress={onButtonPressed}>
          <Text style={styles.regularText}>
            {t('SCREENS.TAB1_SCREEN.TITLE')}
          </Text>
        </AppPressable>
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
    regularText: {
      ...Typography.ts(theme.fonts.weight.desc, theme.fonts.size.desc),
      color: theme.colors.text,
    },
  });
};
