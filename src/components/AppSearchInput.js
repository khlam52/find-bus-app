import React, { useEffect, useState } from 'react';

import { View, TextInput, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppPressable from './AppPressable';
import { ApprovalSearchIcon, CloseIcon } from '~src/assets/images';
import { withAllContext } from '~src/contexts/withAllContext';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';

const AppSearchInput = ({
  searchInputRef,
  onChange,
  placeholder,
  appTheme,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  const {
    theme: { settings: theme, name: themeName },
    setTheme,
  } = appTheme;
  const styles = getStyle(insets, theme);

  const [isShowDelete, setIsShowDelete] = useState(false);

  const onDeleteButtonPressed = () => {
    onChange('');
  };

  useEffect(() => {
    setIsShowDelete(props.value?.length > 0);
    return () => {};
  }, [props.value]);

  return (
    <View style={styles.container}>
      <ApprovalSearchIcon width={sw(16)} height={sw(16)} />
      <TextInput
        ref={searchInputRef}
        value={props.value ? props.value : ''}
        placeholder={placeholder ? placeholder : ''}
        placeholderTextColor={'#8591A5'}
        onChangeText={onChange}
        returnKeyType={'search'}
        style={[styles.textInput]}
        {...props}
      />

      {isShowDelete && (
        <AppPressable onPress={onDeleteButtonPressed}>
          <CloseIcon width={sw(10)} height={sw(10)} fill={'#657693'} />
        </AppPressable>
      )}
    </View>
  );
};

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      flex: 1,
      backgroundColor: 'rgba(215, 220, 226, 0.39)',
      paddingLeft: sw(16),
      paddingRight: sw(20),
      alignItems: 'center',
      borderRadius: theme.roundness.corner,
      minHeight: sw(50),
    },
    textInput: {
      flex: 1,
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.para),
      color: '#8591A5',
      marginHorizontal: sw(8),
    },
  });
};

export default withAllContext(AppSearchInput);
