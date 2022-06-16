import React from 'react';
import { useEffect, useRef, useState, useImperativeHandle } from 'react';

import { StyleSheet, AppState, View, Text } from 'react-native';

import AppPressable from '~src/components/AppPressable';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';
import { sf } from '~src/styles/Mixins';

const CountdownButton = React.forwardRef((props, ref) => {
  const {
    theme: { settings: theme },
  } = useAppTheme();
  let styles = getStyle(props, theme);
  const { locale, setLocale, t } = useLocalization();

  const appState = useRef(AppState.currentState);
  const countSecRef = useRef(props.countDownSec);
  const intervalRef = useRef();
  const untilRef = useRef(Math.max(countSecRef.current, 0));
  const lastUntilRef = useRef(null);
  const wentBackgroundAtRef = useRef(null);
  const [count, setCount] = useState(Math.max(countSecRef.current, 0));
  const [isBtnDisable, setIsBtnDisable] = useState(true);
  const subscription = useRef(null);

  useEffect(() => {
    subscription.current = AppState.addEventListener(
      'change',
      _handleAppStateChange,
    );
    const id = setInterval(() => {
      updateTimer();
    }, 1000);
    intervalRef.current = id;
    return () => {
      subscription.current.remove();
      clearInterval(intervalRef.current);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    console.log(
      'nextAppState',
      nextAppState,
      'appState.current',
      appState.current,
    );
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active' &&
      wentBackgroundAtRef.current
    ) {
      console.log('App has come to the foreground!');
      const diff = (Date.now() - wentBackgroundAtRef.current) / 1000.0;
      lastUntilRef.current = untilRef.current;
      untilRef.current = parseInt(Math.max(0, untilRef.current - diff), 10);
      setCount(untilRef.current);
    }
    if (
      appState.current.match(/inactive|active/) &&
      nextAppState === 'background'
    ) {
      console.log('App has come to the background!');
      wentBackgroundAtRef.current = Date.now();
    }

    appState.current = nextAppState;
    console.log(
      'current AppState',
      appState.current,
      'nextAppState',
      nextAppState,
    );
  };

  const updateTimer = () => {
    if (lastUntilRef.current === untilRef.current) {
      return;
    }
    if (
      untilRef.current === 1 ||
      (untilRef.current === 0 && lastUntilRef.current !== 1)
    ) {
      if (props.onFinish) {
        props.onFinish();
      }
    }

    if (untilRef.current === 0) {
      lastUntilRef.current = 0;
      untilRef.current = 0;
      setIsBtnDisable(false);
    } else {
      lastUntilRef.current = untilRef.current;
      untilRef.current = Math.max(0, untilRef.current - 1);
    }
    setCount(untilRef.current === 0 ? '' : untilRef.current);
  };

  const restartCounter = () => {
    untilRef.current = Math.max(countSecRef.current, 0);
    lastUntilRef.current = null;
    setCount(Math.max(countSecRef.current, 0));
    setIsBtnDisable(true);
  };

  const resendOnPressed = () => {
    restartCounter();
    props.onPress();
  };

  useImperativeHandle(ref, () => ({
    enableResend() {
      lastUntilRef.current = 0;
      untilRef.current = 0;
      setIsBtnDisable(false);
      setCount(null);
    },
    overResendLimit() {
      setIsBtnDisable(true);
      setCount(0);
      lastUntilRef.current = 0;
      untilRef.current = 0;
      subscription.current.remove();
      clearInterval(intervalRef.current);
    },
  }));

  return (
    <View style={styles.viewLoginBtn} ref={ref}>
      <AppPressable
        onPress={resendOnPressed}
        disabled={isBtnDisable}
        style={{ flexDirection: 'row', alignSelf: 'center' }}>
        <Text
          style={[
            {
              color: isBtnDisable ? '#8591A5' : '#132A4A',
            },
            styles.resendText,
          ]}>
          {count
            ? t('SCREENS.OTP_SCREEN.RESENT_OTP_WITH_TIME').replace(
                '{count}',
                count,
              )
            : t('SCREENS.OTP_SCREEN.RESENT_OTP')}
        </Text>
      </AppPressable>
    </View>
  );
});

const getStyle = (props, theme) => {
  return StyleSheet.create({
    resendText: {
      ...Typography.ts(theme.fonts.weight.bold, sf(theme.fonts.size.para)),
      textDecorationLine: 'underline',
    },
  });
};

export default CountdownButton;
