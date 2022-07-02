import React, { useEffect } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BusIcon,
  DarkLongRouteToRouteIcon,
  GoArrowIcon,
  LightLongRouteToRouteIcon,
} from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import { THEME_NAME } from '~src/constants/Constant';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import RootNavigation from '~src/navigations/RootNavigation';
import Route from '~src/navigations/Route';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';
import ListHelper from '~src/utils/ListHelper';

SearchListItemView.defaultProps = {
  item: null,
  index: null,
};

export default function SearchListItemView({ item, index }) {
  const { locale, setLocale, t, getField } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, theme, locale);

  useEffect(() => {
    console.log('SearchListItemView -> useEffect');
  }, []);

  const onItemPressed = async () => {
    let routeDetailList = await ListHelper.getRouteStopList(
      item.route,
      item.bound,
      item.service_type,
      showLoading,
      hideLoading,
    );
    RootNavigation.navigate(Route.ROUTE_MAP_SCREEN, {
      routeDetailList: routeDetailList,
      stationTitle: getDestStationName(),
      routeTitle: item.route,
      selectedItem: item,
    });
  };

  const getOriginStationName = () => {
    return locale === 'en' ? item.orig_en : item.orig_tc;
  };

  const getDestStationName = () => {
    return locale === 'en' ? item.dest_en : item.dest_tc;
  };

  return (
    <AppPressable onPress={onItemPressed}>
      <View key={index} style={styles.itemView}>
        <View style={styles.routeView}>
          <BusIcon fill={theme.colors.secondary} />
          <Text style={styles.routeText}>{item.route}</Text>
        </View>
        <View style={styles.stationLeftView}>
          {themeName === THEME_NAME.DARK ? (
            <DarkLongRouteToRouteIcon />
          ) : (
            <LightLongRouteToRouteIcon />
          )}
          <View>
            <Text
              style={{ ...styles.stationText, paddingBottom: sw(16) }}
              adjustsFontSizeToFit={true}
              numberOfLines={1}>
              {getOriginStationName()}
            </Text>
            <Text
              style={styles.stationText}
              adjustsFontSizeToFit={true}
              numberOfLines={1}>
              {getDestStationName()}
            </Text>
          </View>
        </View>
        <View style={styles.stationRightView}>
          <GoArrowIcon
            fill={theme.colors.secondary}
            width={sw(15)}
            height={sw(15)}
          />
        </View>
      </View>
    </AppPressable>
  );
}

const getStyle = (insets, theme, locale) => {
  return StyleSheet.create({
    itemView: {
      flexDirection: 'row',
      // flex: 1,
      marginBottom: sw(8),
      marginLeft: sw(16),
      marginRight: sw(45),
      backgroundColor: theme.colors.primary,
      borderRadius: sw(10),
      paddingVertical: sw(12),
      alignItems: 'center',
    },
    routeView: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: sw(6),
    },
    routeText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.lead),
      color: theme.colors.text,
      paddingTop: sw(12),
    },
    stationLeftView: {
      flexDirection: 'row',
      flex: 3,
      marginBottom: sw(8),
    },
    stationRightView: {
      // flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
      borderRadius: sw(1000),
      borderWidth: sw(8),
      borderColor: theme.colors.background,
      padding: sw(12),
      marginRight: sw(-40),
    },
    stationText: {
      flex: 1,
      ...Typography.ts(theme.fonts.weight.semibold, theme.fonts.size.desc),
      color: theme.colors.text,
      marginLeft: sw(12),
      marginRight: sw(20),
      paddingTop: locale !== 'en' ? sw(4) : sw(2),
    },
  });
};
