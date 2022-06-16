import React, { useEffect } from 'react';

import _ from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TickIcon, UntickIcon } from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Colors, Typography } from '~src/styles';
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

  const SelectionListRowItem = ({ item, index }) => {
    let rowView = (
      <View
        style={[
          styles.row,
          index !== itemList.length - 1 ? styles.separator : {},
        ]}>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[
              styles.rowText,
              (selectedItem === item ||
                getField(selectedItem, 'name') === getField(item, 'name') ||
                selectedItem === getField(item, 'name')) &&
                Typography.ts(theme.fonts.weight.bold, theme.fonts.size.para),
            ]}>
            {getField(item, 'name')}
          </Text>
          {_.get(item, 'ccyDesc', '') !== null && (
            <Text style={styles.itemDescText}>
              {_.get(item, 'ccyDesc', '')}
            </Text>
          )}
        </View>

        {selectedItem === item ||
        getField(selectedItem, 'name') === getField(item, 'name') ||
        selectedItem === getField(item, 'name') ? (
          <TickIcon
            width={sw(22)}
            height={sw(22)}
            fill={theme.colors.primary}
          />
        ) : (
          <UntickIcon width={sw(22)} height={sw(22)} fill={'#E4E4E4'} />
        )}
      </View>
    );
    if (
      selectedItem === item ||
      getField(selectedItem, 'name') === getField(item, 'name') ||
      selectedItem === getField(item, 'name')
    ) {
      return rowView;
    } else {
      return (
        <AppPressable
          onPress={() => {
            onListItemPressed(item);
          }}>
          {rowView}
        </AppPressable>
      );
    }
  };

  const RoundSelectionListRowItem = ({ item, index }) => {
    let rowView = (
      <View style={[styles.row, styles.round]}>
        <Text
          style={[
            styles.rowText,
            (selectedItem === item ||
              getField(selectedItem, 'name') === getField(item, 'name') ||
              selectedItem === getField(item, 'name')) &&
              Typography.ts(theme.fonts.weight.bold, theme.fonts.size.para),
          ]}>
          {getField(item, 'name')}
        </Text>
        {selectedItem === item ||
        getField(selectedItem, 'name') === getField(item, 'name') ||
        selectedItem === getField(item, 'name') ? (
          <TickIcon
            width={sw(30)}
            height={sw(30)}
            fill={theme.colors.primary}
          />
        ) : null}
      </View>
    );
    if (
      selectedItem === item ||
      getField(selectedItem, 'name') === getField(item, 'name') ||
      selectedItem === getField(item, 'name')
    ) {
      return rowView;
    } else {
      return (
        <AppPressable
          onPress={() => {
            onListItemPressed(item);
          }}>
          {rowView}
        </AppPressable>
      );
    }
  };

  const renderRowItem = ({ item, index }) => {
    return isItemRound ? (
      <RoundSelectionListRowItem item={item} index={index} />
    ) : (
      <SelectionListRowItem item={item} index={index} />
    );
  };

  const renderSeparator = ({ item, index }) => {
    return isItemRound ? <View style={styles.spaceSeparator} /> : null;
  };

  return (
    <FlatList
      style={{ maxHeight: sw(700) }}
      data={itemList}
      renderItem={renderRowItem}
      keyExtractor={(item, index) => 'SelectionListRowItem' + index.toString()}
      scrollEnabled={true}
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
      backgroundColor: Colors.WHITE,
    },
    rowText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.para),
      color: theme.colors.text,
    },
    separator: {
      borderBottomColor: theme.colors.underlayerLt,
      borderBottomWidth: sh(1),
    },
    round: {
      borderRadius: sw(theme.roundness.item),
    },
    spaceSeparator: {
      height: sh(10),
    },
    itemDescText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.desc),
      color: '#657693',
      position: 'absolute',
      paddingHorizontal: sw(90),
      alignSelf: 'center',
    },
  });
};
