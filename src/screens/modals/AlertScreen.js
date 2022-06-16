import React, { useEffect } from 'react';

import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton, { AppSecondaryButton } from '~src/components/AppButton';
import useAppTheme from '~src/contexts/theme';
import { Colors, Typography } from '~src/styles';
import { sh, sw } from '~src/styles/Mixins';

export default function AlertScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  // set default value
  let icon = null;
  let titleText = '';
  let contentText = '';
  let firstButtonText = '';
  let secondButtonText = '';
  let firstButtonHandler = () => {};
  let secondButtonHandler = () => {};
  if (route.params) {
    if (route.params.icon) {
      icon = route.params.icon;
    }
    if (route.params.titleText) {
      titleText = route.params.titleText;
    }
    if (route.params.contentText) {
      contentText = route.params.contentText;
    }
    if (route.params.firstButtonText) {
      firstButtonText = route.params.firstButtonText;
    }
    if (route.params.secondButtonText) {
      secondButtonText = route.params.secondButtonText;
    }
    if (route.params.firstButtonHandler) {
      firstButtonHandler = route.params.firstButtonHandler;
    }
    if (route.params.secondButtonHandler) {
      secondButtonHandler = route.params.secondButtonHandler;
    }
  }

  useEffect(() => {
    console.log('AlertScreen -> useEffect');
  }, []);

  const onLeftButtonPressed = () => {
    navigation.goBack();
    firstButtonHandler();
  };
  const onRightButtonPressed = () => {
    navigation.goBack();
    secondButtonHandler();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors.opacity(Colors.BLACK, 0.5) },
      ]}>
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}>
        <View style={styles.alertOuterView}>
          {icon ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: sh(20),
              }}>
              {icon}
            </View>
          ) : null}
          <Text style={styles.titleText}>{titleText}</Text>
          <Text style={styles.contentText}>{contentText}</Text>
          <View
            style={{
              justifyContent: 'center',
              marginBottom: sh(20),
            }}>
            {firstButtonText ? (
              <AppButton
                text={firstButtonText}
                onPress={onLeftButtonPressed}
                disabled={false}
              />
            ) : null}
            {secondButtonText ? (
              <View style={{ marginTop: sh(24) }}>
                <AppSecondaryButton
                  text={secondButtonText}
                  onPress={onRightButtonPressed}
                  disabled={false}
                  backgroundColor={'#EFEFEF'}
                />
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    btnContainer: {
      justifyContent: 'center',
      marginBottom: sh(20),
    },
    titleText: {
      ...Typography.ts(theme.fonts.weight.semibold, theme.fonts.size.h5),
      color: theme.colors.text,
      textAlign: 'center',
    },
    contentText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.note2),
      color: theme.colors.text,
      textAlign: 'center',
      marginTop: sh(16),
      marginBottom: sh(24),
      // minHeight: sh(92),
    },
    alertOuterView: {
      width: sw(270),
      minHeight: sw(230),
      backgroundColor: Colors.WHITE,
      borderRadius: sw(theme.roundness.corner),
      paddingTop: sh(33),
      paddingHorizontal: sw(21),
    },
  });
};
