import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  BusIcon,
  DarkRouteToRouteIcon,
  FillHeartIcon,
  HeartIcon,
  LightRouteToRouteIcon,
} from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import { THEME_NAME } from '~src/constants/Constant';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';
import ListHelper from '~src/utils/ListHelper';

RouteListItemView.defaultProps = {
  item: null,
  index: null,
};

export default function RouteListItemView({ item, index }) {
  const { locale, setLocale, t, getField } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, theme, locale);

  const [isHeartIconPressed, setIsHeartIconPressed] = useState(false);
  const isHeartIconPressedRef = useRef(false);

  const favouriteList = useStoreState((state) => state.user.favouriteList);

  const setFavouriteList = useStoreActions(
    (action) => action.user.setFavouriteList,
  );

  useEffect(() => {
    console.log('RouteListItemView -> useEffect');
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (ListHelper.isFavouriteItem(item) === true) {
        setIsHeartIconPressed(true);
        isHeartIconPressedRef.current = true;
      } else {
        setIsHeartIconPressed(false);
        isHeartIconPressedRef.current = false;
      }
    }, []),
  );

  const onHeartIconPressed = () => {
    setIsHeartIconPressed(!isHeartIconPressed);
    isHeartIconPressedRef.current = !isHeartIconPressedRef.current;
    if (isHeartIconPressedRef.current) {
      ListHelper.setFavouriteListFunc(item, favouriteList, setFavouriteList);
    } else {
      ListHelper.deleteFavouriteListFunc(item, favouriteList, setFavouriteList);
    }
  };

  const getOriginStationName = () => {
    return locale === 'en' ? item.orig_en : item.orig_tc;
  };

  const getDestStationName = () => {
    return locale === 'en' ? item.dest_en : item.dest_tc;
  };

  return (
    <View key={index} style={styles.itemView}>
      <View style={styles.routeView}>
        <BusIcon fill={theme.colors.secondary} />
        <Text style={styles.routeText}>{item.route}</Text>
      </View>
      <View style={styles.stationView}>
        <View style={styles.stationLeftView}>
          {themeName === THEME_NAME.DARK ? (
            <DarkRouteToRouteIcon />
          ) : (
            <LightRouteToRouteIcon />
          )}
          <View>
            <Text
              style={{ ...styles.stationText, paddingBottom: sw(12) }}
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
          <AppPressable onPress={onHeartIconPressed} disableDelayPress={true}>
            {isHeartIconPressed ? (
              <FillHeartIcon width={sw(30)} height={sw(27)} />
            ) : (
              <HeartIcon width={sw(30)} height={sw(27)} />
            )}
          </AppPressable>
        </View>
      </View>
    </View>
  );
}

const getStyle = (insets, theme, locale) => {
  return StyleSheet.create({
    itemView: {
      flexDirection: 'row',
      flex: 1,
      marginBottom: sw(8),
      marginHorizontal: sw(16),
    },
    routeView: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      marginRight: sw(8),
      paddingVertical: sw(8),
      borderRadius: sw(10),
    },
    routeText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.lead),
      color: theme.colors.text,
      paddingTop: sw(12),
    },
    stationView: {
      flex: 4,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.primary,
      paddingVertical: sw(8),
      paddingHorizontal: sw(8),
      borderRadius: sw(10),
    },
    stationLeftView: {
      flexDirection: 'row',
      flex: 3,
    },
    stationRightView: {
      flex: 1,
      alignItems: 'flex-end',
    },
    stationText: {
      flex: 1,
      ...Typography.ts(theme.fonts.weight.semibold, theme.fonts.size.desc),
      color: theme.colors.text,
      marginLeft: sw(12),
      paddingTop: locale !== 'en' ? sw(4) : sw(2),
    },
  });
};
