/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';

import { useStoreActions, useStoreState } from 'easy-peasy';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import RouteListItemView from './RouteListItemView';
import BackHeader from '~src/components/BackHeader';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import ApiService from '~src/services/ApiService';
import { sw } from '~src/styles/Mixins';

export default function FindBusScreen({ navigation }) {
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading, setIsFinishLaunching } = useAppContext();

  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const allBusRouteList = useStoreState((state) => state.user.allBusRouteList);

  const setAllBusRouteList = useStoreActions(
    (action) => action.user.setAllBusRouteList,
  );

  useEffect(() => {
    console.log('FindBusScreem -> allBusRouteList:', allBusRouteList);
  }, []);

  const getAllRouteList = async () => {
    showLoading();
    setIsRefreshing(true);
    try {
      let response = await ApiService.getKMBAllRouteList();
      console.log('response:', response);
      if (response.data) {
        setAllBusRouteList(response.data);
      }
      hideLoading();
      setIsRefreshing(false);
    } catch (error) {
      hideLoading();
      setIsRefreshing(false);
      console.log('error ->', error);
    }
  };

  const renderItem = ({ item, index }) => {
    return <RouteListItemView item={item} index={index} />;
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
        title={'Find Your Bus'}
        isShowChangeLang={true}
      />
      <FlatList
        data={allBusRouteList}
        renderItem={renderItem}
        ListFooterComponent={listFooterComponent}
        ListHeaderComponent={listHeaderComponent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={getAllRouteList}
          />
        }
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
  });
};
