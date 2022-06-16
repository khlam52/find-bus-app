import React from 'react';

import { TextInput, StyleSheet } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';

import { Typography } from '~src/styles';
import { COLOR_APP_INPUT } from '~src/styles/Colors';
import { WHPercentageToDP } from '~src/styles/Mixins';

const AppInput = ({ onChange, onFocus, placeholder, ...props }) => {
  let styles = getStyle(props);

  return (
    <TextInput
      value={props.value ? props.value : ''}
      placeholder={placeholder ? placeholder : ''}
      placeholderTextColor={COLOR_APP_INPUT.PLACEHOLDER_COLOR}
      onChangeText={onChange}
      style={[styles.inputArea]}
      {...props}
    />
  );
};

const getStyle = (props) => {
  let marginHorizontal = props.marginHorizontal
    ? WHPercentageToDP(props.marginHorizontal)
    : WHPercentageToDP(0);

  let marginVertical = props.marginVertical
    ? WHPercentageToDP(props.marginVertical)
    : WHPercentageToDP(0);

  let marginBottom = props.marginBottom ? props.marginBottom : 0;
  let marginTop = props.marginTop ? props.marginTop : 0;

  return StyleSheet.create({
    inputArea: {
      ...Typography.ts(Typography.FONT_FAMILY_500, 16),
      height: heightPercentageToDP(4),
      marginHorizontal: marginHorizontal,
      marginVertical: marginVertical,
      marginBottom: marginBottom,
      marginTop: marginTop,
      color: COLOR_APP_INPUT.TIN_COLOR,
      borderColor: COLOR_APP_INPUT.BORDER_FOCUS_COLOR,
      borderWidth: 1,
    },
  });
};

export default AppInput;
