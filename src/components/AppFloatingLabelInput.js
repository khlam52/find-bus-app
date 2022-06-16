import React, { useEffect, useState } from 'react';

import { Platform, Text, TextInput, View, StyleSheet } from 'react-native';

import { InputShowPwIcon, InputHidePwIcon } from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import { withAllContext } from '~src/contexts/withAllContext';
import { Typography } from '~src/styles';
import { sh, sw } from '~src/styles/Mixins';

const defaultInputTextColor = '#195078';
const defaultBorderColor = 'transparent';
const defaultBackgroundFocusColor = '#FFFFFF';
const defaultBackgroundColor = '#E5EBF1';
const defaultInputBoxHeight = 72;

// const { theme } = useAppTheme();

const AppFloatingLabelInput = React.forwardRef(
  (
    {
      value,
      placeholder,
      inputState,
      maxLength,
      isDisplayErrorMsg,
      onChangeText,
      onFocus,
      onBlur,
      ...props
    },
    ref,
  ) => {
    // custom color for app input
    let {
      placeHolderTextFocusColor,
      placeHolderTextColor,
      inputTextColor,
      borderFocusColor,
      borderColor,
      backgroundFocusColor,
      backgroundColor,
      appTheme: {
        theme: { settings: theme },
      },
      appLocalization: { locale },
    } = props;

    // set custom color if any
    if (!placeHolderTextFocusColor) {
      placeHolderTextFocusColor = theme.colors.placeholderFocus;
    }

    if (!placeHolderTextColor) {
      placeHolderTextColor = theme.colors.placeholder;
    }

    if (!inputTextColor) {
      inputTextColor = theme.colors.text;
    }

    if (!borderFocusColor) {
      borderFocusColor = theme.colors.borderFocus;
    }

    if (!borderColor) {
      borderColor = theme.colors.border;
    }

    if (!backgroundColor) {
      backgroundColor = theme.colors.inputBlur;
    }

    if (!backgroundFocusColor) {
      backgroundFocusColor = theme.colors.inputFocus;
    }

    let colorValues = {
      inputTextColor,
      placeHolderTextColor,
      placeHolderTextFocusColor,
      borderColor,
      borderFocusColor,
      backgroundColor,
      backgroundFocusColor,
    };
    // set custom color if any

    const styles = getStyle({ ...theme, ...colorValues }, locale, Platform.OS);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [isPassword, setIsPassword] = useState(props.secureTextEntry);
    const [showPasswordEyeIcon, setShowPasswordEyeIcon] = useState(
      props.eyeIcon,
    );
    const [errorMessages, setErrorMessages] = useState([]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    useEffect(() => {
      console.log('AppFloatingLabelInput -> useEffect -> locale : ', locale);
    }, []);

    useEffect(() => {
      console.log('AppFloatingLabelInput -> useEffect -> value: ', value);
      value.length > 0 ? setHasValue(true) : setHasValue(false);
    }, [value]);

    const showPassword = () => {
      setIsPassword((prevState) => !prevState);
    };

    const textInputStyle = {
      ...Typography.ts(Typography.FONT_FAMILY_400, 18, 22.5),
      color: inputTextColor,
      marginTop: isFocused || hasValue ? sw(theme.spacings.s2) : 0,
      paddingBottom: Platform.OS === 'android' ? sh(5) : 0,
      paddingLeft: Platform.OS === 'android' ? -sh(5) : 0,
      flex: 1,
    };

    const componentOnTextChange = (_inputText) => {
      if (onChangeText !== undefined && onChangeText !== null) {
        const validationResult = onChangeText(_inputText);
        setErrorMessages(
          validationResult !== undefined && validationResult !== null
            ? validationResult
            : [],
        );
      }
    };

    const componentOnFocus = () => {
      handleFocus();
      if (onFocus !== undefined && onFocus !== null) {
        onFocus();
      }
    };

    const componentOnBlur = () => {
      handleBlur();
      if (onBlur !== undefined && onBlur !== null) {
        onBlur();
      }
    };

    return [
      <View
        key={'componentMainView'}
        style={{
          ...styles.outerViewStyle,
          ...(isFocused
            ? styles.outerViewStyleFocus
            : styles.outerViewStyleBlur),
        }}>
        <Text
          style={{
            ...styles.placeholderStyle,
            ...(isFocused || hasValue ? styles.placeholderActiveStyle : null),
          }}>
          {placeholder}
        </Text>
        <TextInput
          {...props}
          value={value}
          style={textInputStyle}
          onFocus={componentOnFocus}
          onBlur={componentOnBlur}
          secureTextEntry={isPassword}
          maxLength={maxLength}
          ref={ref}
          onChangeText={componentOnTextChange}
          autoCorrect={false}
          autoCapitalize={'none'}
        />
        {showPasswordEyeIcon && (
          <View style={styles.viewShowPassowrd}>
            <AppPressable onPress={showPassword}>
              {isPassword && (
                <InputShowPwIcon
                  width={sw(24)}
                  height={sw(22)}
                  fill={theme.colors.text60}
                />
              )}
              {!isPassword && (
                <InputHidePwIcon
                  width={sw(24)}
                  height={sw(22)}
                  fill={theme.colors.text60}
                />
              )}
            </AppPressable>
          </View>
        )}
        <View
          key={'componentUnderlineView'}
          style={
            isDisplayErrorMsg === true || errorMessages.length > 0
              ? styles.displayErrUnderlineColor
              : null
          }
        />
      </View>,
      <View key={'componentErrorMessageView'}>
        {/* Error Message */}
        {errorMessages.map((itm, index) => {
          return (
            <Text
              key={'inputErrorMessage' + index}
              style={styles.errorMessageText}>
              {itm.message}
            </Text>
          );
        })}
      </View>,
    ];
  },
);

const getStyle = (theme, locale, os) => {
  return StyleSheet.create({
    outerViewStyle: {
      height: sw(defaultInputBoxHeight),
      paddingHorizontal: sw(theme.spacings.s2),
      paddingVertical: sw(2),
      borderWidth: sw(1),
      borderRadius: sw(theme.roundness.corner),
      overflow: 'hidden',
    },
    outerViewStyleBlur: {
      borderColor: theme.borderColor,
      backgroundColor: theme.backgroundColor,
    },
    outerViewStyleFocus: {
      borderColor: theme.borderFocusColor,
      backgroundColor: theme.backgroundFocusColor,
    },
    placeholderStyle: {
      position: 'absolute',
      left: sw(17),
      top: sw(24.75),
      ...Typography.ts(
        theme.fonts.weight.regular,
        theme.fonts.size.lead,
        sw(theme.fonts.size.lead + 4),
      ),
      color: theme.placeHolderTextColor,
      ...(os !== 'android' && locale !== 'en'
        ? { paddingTop: sw(theme.fonts.size.lead * 0.15) }
        : null),
    },
    placeholderActiveStyle: {
      top: sh(9),
      ...Typography.ts(
        theme.fonts.weight.regular,
        theme.fonts.size.note2,
        17.5,
      ),
      color: theme.placeHolderTextFocusColor,
    },
    viewShowPassowrd: {
      position: 'absolute',
      right: sw(0),
      marginTop: sh((defaultInputBoxHeight - 22) / 2),
      marginRight: sw(theme.spacings.s2),
    },
    displayErrOuterView: {
      height: sh(65),
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    displayErrUnderlineColor: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: sw(4),
      backgroundColor: theme.colors.alertUnderline,
    },
    errorMessageText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.desc),
      color: theme.colors.alert,
      marginTop: sh(theme.spacings.s1),
    },
  });
};

// export default AppFloatingLabelInput;
export default withAllContext(AppFloatingLabelInput);
