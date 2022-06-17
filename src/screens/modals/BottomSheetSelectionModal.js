import React, { useEffect, useState } from 'react';

import _ from 'lodash';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CloseIcon } from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import BottomSheet from '~src/components/BottomSheet';
import SelectionFlatList from '~src/components/SelectionFlatList';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';
import { sh, sw } from '~src/styles/Mixins';

export default function BottomSheetSelectionModal({ route, navigation }) {
  const { locale, setLocale, t, getField } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(true);
  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, { theme, themeName });

  const [title, setTitle] = useState(_.get(route, 'params.title', ''));
  const selectionListArray = _.get(route, 'params.selectionListArray', []);
  const [selectedItem, setSelectedItem] = useState(selectionListArray[0]);
  let selectedCallbackCallback = _.get(
    route,
    'params.selectedCallback',
    () => {},
  );

  useEffect(() => {
    console.log('BottomSheetSelectionModal -> useEffect');
    const paramsSelectedItem = _.get(route, 'params.selectedItem', null);
    if (paramsSelectedItem) {
      console.log(`paramsSelectedItem: ${JSON.stringify(paramsSelectedItem)}`);
      setSelectedItem(paramsSelectedItem);
    } else {
      setSelectedItem(selectionListArray[0]);
    }
    initData();
  }, []);

  const initData = async () => {};

  const onCloseButtonPressed = async () => {
    navigation.goBack();
  };

  const onItemSelected = (item) => {
    selectedCallbackCallback(item);
    navigation.goBack();
  };
  const renderSelectionView = () => {
    return (
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <AppPressable
              onPress={onCloseButtonPressed}
              hitSlop={{ top: 100, left: 100, bottom: 100, right: 100 }}>
              <CloseIcon fill={theme.colors.text} />
            </AppPressable>
          </View>

          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.separator} />
          <SelectionFlatList
            selectedItem={selectedItem}
            itemList={selectionListArray}
            onSelectionListItemPressed={onItemSelected}
          />
        </View>
      </View>
    );
  };
  return (
    <BottomSheet
      view={renderSelectionView()}
      isOpenBottomSheet={isOpenBottomSheet}
      onSetIsOpenBottomSheet={setIsOpenBottomSheet}
    />
  );
}

const getStyle = (insets, { theme, themeName }) => {
  return StyleSheet.create({
    separator: {
      borderBottomColor: theme.colors.text,
      borderBottomWidth: sh(1),
      marginHorizontal: sw(theme.spacings.s2),
    },
    outerContainer: {
      flex: 1,
      flexDirection: 'column-reverse',
    },
    container: {
      borderTopLeftRadius: sw(theme.roundness.container),
      borderTopRightRadius: sw(theme.roundness.container),
      backgroundColor: theme.colors.primary,
      paddingBottom: sh(20),
    },
    buttonContainer: {
      paddingLeft: sw(theme.spacings.s3),
      marginTop: sh(theme.spacings.s3),
      flexDirection: 'row-reverse',
    },
    titleText: {
      textAlign: 'center',
      marginTop: sh(5),
      marginBottom: sh(18),
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.h4),
      color: theme.colors.text,
    },
  });
};
