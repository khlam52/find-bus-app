/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import BigList from 'react-native-big-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SearchKeyboardButtonView from './SearchKeyboardButtonView';
import SearchListItemView from './SearchListItemView';
import { SearchIcon } from '~src/assets/images';
import BackHeader from '~src/components/BackHeader';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';
import ListHelper from '~src/utils/ListHelper';

export default function SearchScreen({ navigation }) {
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading, setIsFinishLaunching } = useAppContext();

  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  const [searchRoute, setSearchRoute] = useState('');

  const renderItem = ({ item, index }) => {
    return <SearchListItemView item={item} index={index} />;
  };

  const listHeaderComponent = () => {
    return <View style={styles.listHeaderView} />;
  };

  const listFooterComponent = () => {
    return <View style={styles.listFooterView} />;
  };

  return (
    <View style={styles.container}>
      <BackHeader
        leftElement={null}
        title={t('SCREENS.SEARCH_SCREEN.TITLE')}
        isShowChangeLang={true}
      />

      <View style={styles.searchBarView}>
        <SearchIcon fill={theme.colors.secondary} />
        <Text style={styles.searchText}>
          {searchRoute ? searchRoute : t('SCREENS.SEARCH_SCREEN.PLACEHOLDER')}
        </Text>
      </View>

      {/* <FlatList
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={10 / 2}
        bounces={false}
        data={ListHelper.updateSearchList(searchRoute)}
        renderItem={renderItem}
        ListFooterComponent={listFooterComponent}
        ListHeaderComponent={listHeaderComponent}
        // keyExtractor={(item, index) => index}
      /> */}

      <BigList
        bounces={false}
        itemHeight={sw(110)}
        footerHeight={sw(450)}
        headerHeight={sw(36)}
        data={ListHelper.updateSearchList(searchRoute)}
        renderItem={renderItem}
        renderFooter={listFooterComponent}
        renderHeader={listHeaderComponent}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.keyboardView}>
        <SearchKeyboardButtonView
          searchRoute={searchRoute}
          setSearchRoute={setSearchRoute}
        />
      </View>
    </View>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchBarView: {
      marginTop: sw(36),
      flexDirection: 'row',
      backgroundColor: theme.colors.primary,
      paddingVertical: sw(12),
      paddingLeft: sw(18),
      borderRadius: sw(30),
      marginHorizontal: sw(28),
      marginBottom: sw(18),
    },
    searchText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.para),
      color: theme.colors.text,
      paddingLeft: sw(16),
    },
    listHeaderView: {
      paddingTop: sw(18),
    },
    listFooterView: {
      paddingBottom: sw(450),
    },
    keyboardView: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
};
