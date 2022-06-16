import React, { useState, useEffect, useRef } from 'react';

import debounce from 'lodash.debounce';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowRightIcon } from '~src/assets/images';
import { withAllContext } from '~src/contexts/withAllContext';
import { Colors, Typography } from '~src/styles';
import { sf, sw } from '~src/styles/Mixins';

const BaseButton = ({
  onPress,
  leftIcon,
  rightIcon,
  text,
  appTheme: {
    theme: { settings: theme },
  },
  ...props
}) => {
  // console.log('BaseButton -> props : ', props);
  // console.log('BaseButton -> theme : ', theme);
  let styles = getStyle({ props, theme: theme });
  const timerId = useRef(null);
  const [isDisabled, toggleDisable] = useState(false);

  useEffect(() => {
    return () => {
      if (isDisabled === true) {
        toggleDisable(false);
        // clearTimeout(timerId.current);
      }
    };
  }, [isDisabled]);

  const btnOnPressed = () => {
    toggleDisable(true);
    // //detect if double Press
    // const now = new Date().getTime();
    // const delta = now - this.lastImagePress;
    // const DOUBLE_PRESS_DELAY = 300;
    // if (delta < DOUBLE_PRESS_DELAY) {
    //   delete this.lastImagePress;
    // } else {
    //   this.lastImagePress = now;
    onPress();
    timerId.current = setTimeout(() => {
      toggleDisable(false);
    }, 1000);
    // }
  };

  const getIsDisabledBtn = () => {
    let onPropsDisabled = props.disabled ? props.disabled : false;
    return onPropsDisabled || isDisabled;
  };

  return (
    <Pressable
      onPress={debounce(btnOnPressed, 1000, {
        leading: true,
        trailing: false,
      })}
      // disabled={props.disabled}
      disabled={getIsDisabledBtn()}
      style={({ pressed }) => [
        styles.btnContainer,
        styles.btnStyle,
        props.disabled
          ? styles.btnDisabledStyle
          : pressed
          ? styles.btnDisabledStyle
          : {},
      ]}>
      {({ pressed }) => (
        <View style={[styles.contentContainer]}>
          {leftIcon}
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit={true}
            style={[
              styles.btnText,
              Typography.ts(
                theme.fonts.weight.bold,
                props.btnTextFontSize
                  ? props.btnTextFontSize
                  : theme.fonts.size.para,
              ),
              props.disabled
                ? styles.textDisabledStyle
                : pressed
                ? styles.textDisabledStyle
                : {},
            ]}>
            {text}
          </Text>
          {rightIcon && (
            <View
              style={
                props.rightIconTransform
                  ? {
                      transform: [
                        {
                          rotate: props.rightIconExpanded ? '270deg' : '90deg',
                        },
                      ],
                    }
                  : null
              }>
              <ArrowRightIcon
                width={sw(12)}
                height={sw(20)}
                fill={
                  pressed
                    ? Colors.opacity(theme.colors.text, 0.3)
                    : theme.colors.text
                }
              />
            </View>
          )}
          {/* {rightIcon} */}
        </View>
      )}
    </Pressable>
  );
};

const getStyle = ({ theme, props }) => {
  const defaultHeight = 56;
  let btnWidth = props.btnWidth ? props.btnWidth : 'auto';
  let btnHeight = props.btnHeight ? props.btnHeight : sw(defaultHeight);
  let btnRoundness =
    props.btnRoundness !== undefined
      ? sw(props.btnRoundness)
      : sw(theme.roundness.corner);
  let backgroundColor = props.isTransparent
    ? '#FFFFFF01'
    : props.backgroundColor
    ? props.backgroundColor
    : theme.colors.primary;
  let borderRadius = props.isRound ? sw(defaultHeight / 2) : btnRoundness;
  let borderColor = props.borderColor ? props.borderColor : Colors.SECONDARY;
  let borderWidth = props.borderWidth ? props.borderWidth : 0;
  let paddingHorizontal = props.paddingHorizontal ? props.paddingHorizontal : 0;
  let paddingBottom = props.paddingB ? props.paddingB : 0;
  let paddingTop = props.paddingT ? props.paddingT : 0;
  let btnStylePaddingHorizontal =
    props.btnStylePaddingHorizontal !== undefined
      ? props.btnStylePaddingHorizontal
      : sw(20);
  let btnTextMarginHorizontal =
    props.btnTextMarginHorizontal !== undefined
      ? props.btnTextMarginHorizontal
      : sw(8);
  let btnTextColor = props.btnTextColor
    ? props.btnTextColor
    : theme.colors.textOnPrimary;
  let btnTextFontSize = props.btnTextFontSize
    ? props.btnTextFontSize
    : sf(theme.fonts.size.para);
  let btnJustify = props.btnJustify ? props.btnJustify : 'center';
  let btnDisabledStyleBackgroundColor;
  if (props.btnDisabledColor) {
    btnDisabledStyleBackgroundColor =
      props.btnDisabledColor !== undefined
        ? props.btnDisabledColor
        : theme.colors;
  } else if (props.isTransparent) {
    btnDisabledStyleBackgroundColor = 'transparent';
  } else {
    btnDisabledStyleBackgroundColor = Colors.opacity(backgroundColor, 0.3);
  }
  return StyleSheet.create({
    btnContainer: {
      width: '100%',
      paddingHorizontal: paddingHorizontal,
      paddingBottom: paddingBottom,
      marginTop: paddingTop,
    },
    btnStyle: {
      width: btnWidth,
      height: btnHeight,
      backgroundColor: backgroundColor,
      borderRadius: borderRadius,
      borderColor: borderColor,
      borderWidth: borderWidth,
      justifyContent: 'center',
      paddingHorizontal: btnStylePaddingHorizontal,
    },
    btnDisabledStyle: {
      backgroundColor: btnDisabledStyleBackgroundColor,
      borderColor: Colors.opacity(borderColor, 0.3),
    },
    textDisabledStyle: {
      color: Colors.opacity(btnTextColor, 0.3),
    },
    contentContainer: {
      flexDirection: 'row',
      justifyContent: btnJustify,
      alignItems: 'center',
      textAlign: 'center',
    },
    btnText: {
      ...Typography.ts(theme.fonts.weight.bold, btnTextFontSize),
      marginHorizontal: btnTextMarginHorizontal,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: btnTextColor,
    },
    btnTextDisable: {
      backgroundColor: btnDisabledStyleBackgroundColor,
    },
  });
};

BaseButton.defaultProps = {
  onPress: () => {},
  leftIcon: null,
  rightIcon: null,
  text: '',
};

export default withAllContext(BaseButton);
