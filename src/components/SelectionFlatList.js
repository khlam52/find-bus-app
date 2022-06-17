import React, { useEffect } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppPressable from './AppPressable';
import {
  DarkTickIcon,
  DarkUnTickIcon,
  LightTickIcon,
  LightUnTickIcon,
} from '~src/assets/images';
import { THEME_NAME } from '~src/constants/Constant';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';
import { sh, sw } from '~src/styles/Mixins';

SelectionFlatList.defaultProps = {
  selectedItem: null,
  itemList: [],
  onSelectionListItemPressed: null,
  isItemRound: false,
};

export default function SelectionFlatList({
  selectedItem,
  itemList,
  onSelectionListItemPressed,
  isItemRound,
}) {
  const { locale, setLocale, t, getField } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, { theme, themeName });

  useEffect(() => {
    console.log('SelectionFlatList -> useEffect');
  }, []);

  const onListItemPressed = (item) => {
    if (onSelectionListItemPressed) {
      onSelectionListItemPressed(item);
    }
  };

  const getTickIconTheme = (item) => {
    return themeName === THEME_NAME.DARK ? (
      selectedItem === item ? (
        <DarkTickIcon />
      ) : (
        <DarkUnTickIcon />
      )
    ) : selectedItem === item ? (
      <LightTickIcon />
    ) : (
      <LightUnTickIcon />
    );
  };

  const renderItem = ({ item, index }) => {
    return (
      <AppPressable
        key={index}
        onPress={() => {
          onListItemPressed(item);
        }}>
        <View style={styles.row}>
          <Text
            style={{
              ...Typography.ts(
                selectedItem === item
                  ? theme.fonts.weight.bold
                  : theme.fonts.weight.semibold,
                theme.fonts.size.lead,
              ),
              color:
                selectedItem === item
                  ? theme.colors.secondary
                  : theme.colors.text,
            }}>
            {item.name}
          </Text>
          {getTickIconTheme(item)}
        </View>
      </AppPressable>
    );
  };

  const renderSeparator = ({ item, index }) => {
    return <View style={styles.spaceSeparator} />;
  };

  return (
    <FlatList
      data={itemList}
      renderItem={renderItem}
      keyExtractor={(item, index) => 'SelectionListRowItem' + index.toString()}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={renderSeparator}
    />
  );
}

const getStyle = (insets, { theme, themeName }) => {
  return StyleSheet.create({
    row: {
      paddingHorizontal: sw(theme.spacings.s2),
      height: sh(64),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
    },
    spaceSeparator: {
      height: sh(1),
      backgroundColor: theme.colors.text,
      marginHorizontal: sw(theme.spacings.s2),
    },
  });
};
