import React, { useEffect, useState } from 'react';

import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import CommonUtil from '~src/utils/CommonUtil';

const defaultHitSlopDimension = 60;

export default function AppPressable({
  style,
  children,
  onPress,
  hitOffset,
  ...props
}) {
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const [hitRectOffset, setHitRectOffset] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const insets = useSafeAreaInsets();
  const styles = getStyle({ insets, props });

  useEffect(() => {}, [hitRectOffset]);
  const onBtnPressed = () => {
    CommonUtil.preventMultiTap(onPress);
  };

  let disableDelayPress = props.disableDelayPress
    ? props.disableDelayPress
    : false;

  return (
    <Pressable
      onLayout={({
        nativeEvent: {
          layout: { width, height },
        },
      }) => {
        const widthOffset =
          defaultHitSlopDimension - width > 0
            ? (defaultHitSlopDimension - width) / 2
            : 0;
        const heightOffset =
          defaultHitSlopDimension - height > 0
            ? (defaultHitSlopDimension - height) / 2
            : 0;
        setHitRectOffset({
          top: heightOffset,
          bottom: heightOffset,
          left: widthOffset,
          right: widthOffset,
        });
      }}
      hitSlop={{
        top: hitRectOffset.top / 1.5,
        right: hitRectOffset.right / 1.5,
        bottom: hitRectOffset.bottom / 1.5,
        left: hitRectOffset.left / 1.5,
      }}
      pressRetentionOffset={{
        top: hitRectOffset.top,
        right: hitRectOffset.right,
        bottom: hitRectOffset.bottom,
        left: hitRectOffset.left,
      }}
      onPress={disableDelayPress ? onPress : onBtnPressed}
      style={({ pressed }) => {
        let extraStyle = null;
        if (style && typeof style === 'function') {
          extraStyle = style({ pressed });
        } else if (style && typeof style === 'object') {
          extraStyle = style;
        }
        return [
          props.disabled
            ? styles.btnDisabledStyle
            : pressed
            ? styles.btnDisabledStyle
            : styles.btnStyle,
          extraStyle,
        ];
      }}
      {...props}>
      {children}
    </Pressable>
  );
}

const getStyle = ({ insets, props }) => {
  return StyleSheet.create({
    btnStyle: {
      backgroundColor: 'transparent',
    },
    btnDisabledStyle: {
      opacity: props.setOpacity ? props.setOpacity : 0.3,
    },
  });
};
