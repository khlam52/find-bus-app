/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';

import { useStoreState } from 'easy-peasy';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import FavouriteListItemView from './FavouriteListItemView';
import { AddHeartIcon } from '~src/assets/images';
import BackHeader from '~src/components/BackHeader';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';

export default function FavouriteScreen({ navigation }) {
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading, setIsFinishLaunching } = useAppContext();

  const menuRef = useRef(null);

  const [selectedLang, setSelectedLang] = useState({});

  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  const favouriteList = useStoreState((state) => state.user.favouriteList);

  useEffect(() => {
    // showLoading();
  }, []);

  const renderItem = ({ item, index }) => {
    return <FavouriteListItemView item={item} index={index} />;
  };

  const listHeaderComponent = () => {
    return <View style={styles.listHeaderView} />;
  };

  const listFooterComponent = () => {
    return <View style={styles.listFooterView} />;
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyView}>
        <AddHeartIcon fill={theme.colors.secondary} />
        <Text style={styles.emptyText}>{'Add Favourite First!'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <BackHeader
        leftElement={null}
        title={'Favourite List'}
        isShowChangeLang={true}
      />
      <FlatList
        bounces={false}
        data={favouriteList}
        renderItem={renderItem}
        ListFooterComponent={listFooterComponent}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={listEmptyComponent}
      />
    </View>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listHeaderView: {
      paddingTop: sw(36),
    },
    listFooterView: {
      paddingBottom: sw(120),
    },
    emptyView: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: sw(80),
    },
    emptyText: {
      ...Typography.ts(theme.fonts.weight.bold, sw(18)),
      color: theme.colors.secondary,
      paddingTop: sw(38),
    },
  });
};
