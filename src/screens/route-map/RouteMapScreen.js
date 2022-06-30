import React, { useCallback, useEffect, useRef, useState } from 'react';

import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect } from '@react-navigation/native';
import { useStoreActions, useStoreState } from 'easy-peasy';
import _ from 'lodash';
import moment from 'moment';
import {
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RESULTS } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Polyline } from 'react-native-svg';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BackIcon,
  DarkMapNotSelectedStopIcon,
  DarkMapSelectedStopIcon,
  FillHeartIcon,
  HeartIcon,
  LightMapNotSelectedStopIcon,
  LightMapSelectedStopIcon,
} from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import BaseHeader from '~src/components/BaseHeader';
import { THEME_NAME } from '~src/constants/Constant';
import useAppContext from '~src/contexts/app';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';
import ListHelper from '~src/utils/ListHelper';
import PermissionUtil from '~src/utils/PermissionUtil';

export default function RouteMapScreen({ navigation, route }) {
  const { locale, setLocale, t } = useLocalization();
  const { showLoading, hideLoading } = useAppContext();
  const insets = useSafeAreaInsets();
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  const styles = getStyle(insets, theme);

  const routeDetailList = _.get(route, 'params.routeDetailList', []);
  const stationTitle = _.get(route, 'params.stationTitle', '');
  const routeTitle = _.get(route, 'params.routeTitle', '');
  const selectedItem = _.get(route, 'params.selectedItem', {});

  const [isHeartIconPressed, setIsHeartIconPressed] = useState(false);
  const isHeartIconPressedRef = useRef(false);

  const mapRef = useRef(null);

  const [currentLat, setCurrentLat] = useState(22.280499);
  const [currentLng, setCurrentLng] = useState(114.157612);
  const [isGotGeoLoc, setIsGotGeoLoc] = useState(false);

  const [selectedStop, setSelectedStop] = useState(null);

  const markerListRef = useRef([]);
  const latLongListRef = useRef([]);
  const [stopETAList, setStopETAList] = useState(null);

  const positionList = useRef([]);

  const selectedStopPositionRef = useRef(null);

  const allStopDetailList = useStoreState(
    (state) => state.user.allStopDetailList,
  );

  const favouriteList = useStoreState((state) => state.user.favouriteList);

  const setFavouriteList = useStoreActions(
    (action) => action.user.setFavouriteList,
  );

  useFocusEffect(
    useCallback(() => {
      if (ListHelper.isFavouriteItem(selectedItem) === true) {
        setIsHeartIconPressed(true);
        isHeartIconPressedRef.current = true;
      } else {
        setIsHeartIconPressed(false);
        isHeartIconPressedRef.current = false;
      }
    }, []),
  );

  useEffect(() => {
    console.log('routeDetailList:', routeDetailList);
    getCurrentLocation();
    getRestructuredList();
    console.log('markerList:', markerListRef);
  }, []);

  const layoutAnimationFunc = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  // do First Task
  const getRestructuredList = () => {
    let intersectionList = _.intersectionBy(
      allStopDetailList,
      routeDetailList,
      'stop',
    );

    markerListRef.current = _.map(routeDetailList, (item) => {
      let StopDetailItem = _.find(intersectionList, function (ele) {
        return ele.stop === item.stop;
      });
      return {
        ...item,
        ...StopDetailItem,
      };
    });

    latLongListRef.current = _.map(markerListRef.current, (item) => {
      return {
        latitude: item.lat,
        longitude: item.long,
      };
    });
  };

  const getStopItemPositionList = (item, y) => {
    if (markerListRef.current.length > 0) {
      let list = _.find(markerListRef.current, (items) => {
        return items.stop === item.stop;
      });
      positionList.current.push({
        stop: list.stop,
        yCoor: y,
      });
    }
  };

  const getCurrentLocation = async () => {
    let result = await PermissionUtil.requestLocationPermission();
    if (result === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        async (position) => {
          setCurrentLat(position.coords.latitude);
          setCurrentLng(position.coords.longitude);
          setIsGotGeoLoc(true);

          zoomToMap(position.coords.latitude, position.coords.longitude);
        },
        (error) => console.log(error.message),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
      );
    }
  };
  ////

  const onMakerClick = async (item, index) => {
    layoutAnimationFunc();
    setSelectedStop(item);
    setCurrentLat(item.lat);
    setCurrentLng(item.long);
    zoomToMap(item.lat, item.long);

    let stopEtaList = await ListHelper.getKMBStopThreeETAList(
      item.stop,
      item.route,
    );
    setStopETAList(stopEtaList);

    console.log('positionList.current:', positionList.current, item);

    let yCoor = _.find(positionList.current, (ele) => {
      if (item.stop === ele.stop) {
        return ele;
      }
    }).yCoor;
    console.log('yCoor:', yCoor);

    selectedStopPositionRef.current.scrollTo({
      x: 0,
      y: Number(yCoor),
      animated: true,
    });
  };

  const zoomToMap = (lat, lng) => {
    if (mapRef && mapRef.current) {
      let tempCoords = {
        latitude: Number(lat),
        longitude: Number(lng),
      };
      mapRef.current.animateCamera({
        center: tempCoords,
        pitch: 2,
        heading: 20,
        altitude: 200,
        zoom: 8,
        duration: 500,
      });
    }
  };

  const getDestStationName = (item) => {
    return locale === 'en' ? item.name_en : item.name_tc;
  };

  const onStopItemPressed = async (item) => {
    layoutAnimationFunc();
    setSelectedStop(item);
    setCurrentLat(item.lat);
    setCurrentLng(item.long);
    zoomToMap(item.lat, item.long);

    let stopEtaList = await ListHelper.getKMBStopThreeETAList(
      item.stop,
      item.route,
    );
    setStopETAList(stopEtaList);
    console.log('stopEtaList:', stopEtaList);
  };

  const getDiffETAMinutes = (eta) => {
    let currentTime = new Date();
    return moment(eta).diff(moment(currentTime), 'minutes');
  };

  const onHeartIconPressed = () => {
    setIsHeartIconPressed(!isHeartIconPressed);
    isHeartIconPressedRef.current = !isHeartIconPressedRef.current;
    if (isHeartIconPressedRef.current) {
      ListHelper.setFavouriteListFunc(
        selectedItem,
        favouriteList,
        setFavouriteList,
      );
    } else {
      ListHelper.deleteFavouriteListFunc(
        selectedItem,
        favouriteList,
        setFavouriteList,
      );
    }
  };

  return (
    <View style={styles.container}>
      <BaseHeader
        title={t('SCREENS.MAP_SCREEN.TITLE', {
          route: routeTitle,
          station: stationTitle,
        })}
        leftElement={
          <AppPressable
            onPress={() => {
              navigation.goBack();
            }}>
            <BackIcon fill={theme.colors.text} />
          </AppPressable>
        }
        rightElement={
          <AppPressable onPress={onHeartIconPressed} disableDelayPress={true}>
            {isHeartIconPressed ? (
              <FillHeartIcon width={sw(30)} height={sw(27)} />
            ) : (
              <HeartIcon width={sw(30)} height={sw(27)} />
            )}
          </AppPressable>
        }
      />
      <MapView
        userInterfaceStyle="light"
        ref={mapRef}
        style={styles.mapView}
        initialRegion={{
          latitude: Number(currentLat),
          longitude: Number(currentLng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
        loadingEnabled={true}
        cacheEnabled={false}>
        {/* Generate Marker */}
        {markerListRef.current.map((marker, index) => (
          <Marker
            key={index}
            // identifier={'' + marker.id}
            coordinate={{
              latitude: Number(marker.lat),
              longitude: Number(marker.long),
            }}
            onPress={(e) => {
              console.log('BranchMapScreen -> clicked marker: ', marker);
              onMakerClick(marker, index);
            }}
            pinColor={selectedStop === marker ? '#455960' : '#7A8C93'}
            // image={{
            //   uri:
            //     selectedStop === marker
            //       ? '~src/assets/images/background/selected-location-icon.png'
            //       : 'marker_icon',
            // }}
          />
        ))}
        <Polyline
          coordinates={latLongListRef.current}
          strokeWidth={6}
          strokeColor="#455960"
          lineJoin={'round'}
          geodesic={true}
          lineCap={'round'}
        />
      </MapView>
      <ScrollView
        style={styles.stopListView}
        ref={selectedStopPositionRef}
        showsVerticalScrollIndicator={false}>
        {markerListRef.current.map((item, index) => {
          return (
            <AppPressable
              onLayout={(event) => {
                const layout = event.nativeEvent.layout;
                getStopItemPositionList(item, layout.y);
              }}
              disableDelayPress={true}
              key={index}
              style={styles.stopItemWholeview}
              onPress={() => {
                onStopItemPressed(item);
              }}>
              <View style={styles.stopItemview}>
                <View style={styles.stopLeftItemView}>
                  {themeName === THEME_NAME.DARK ? (
                    selectedStop === item ? (
                      <DarkMapSelectedStopIcon />
                    ) : (
                      <DarkMapNotSelectedStopIcon />
                    )
                  ) : selectedStop === item ? (
                    <LightMapSelectedStopIcon />
                  ) : (
                    <LightMapNotSelectedStopIcon />
                  )}
                  <Text style={styles.stopItemText}>
                    {item.seq + '. ' + getDestStationName(item)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  {selectedStop === item ? (
                    <ArrowUpIcon fill={theme.colors.secondary} />
                  ) : (
                    <ArrowDownIcon fill={theme.colors.secondary} />
                  )}
                </View>
              </View>
              {selectedStop === item &&
                (stopETAList && stopETAList[0].eta ? (
                  stopETAList.map((etaItem, etaIndex) => {
                    return (
                      etaIndex < 3 &&
                      getDiffETAMinutes(etaItem.eta) > 0 && (
                        <View key={etaIndex}>
                          <Text style={styles.etaText}>
                            {t('SCREENS.MAP_SCREEN.MINS', {
                              time: getDiffETAMinutes(etaItem.eta),
                            })}
                          </Text>
                        </View>
                      )
                    );
                  })
                ) : (
                  <Text style={styles.etaText}>
                    {t('SCREENS.MAP_SCREEN.NO_ETA')}
                  </Text>
                ))}
            </AppPressable>
          );
        })}
        <View style={{ paddingBottom: sw(90) }} />
      </ScrollView>
    </View>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#FFFFFF',
    },
    mapView: {
      height: sw(400),
    },
    stopListView: {
      flex: 1,
      backgroundColor: theme.colors.keyboardBackground,
      borderTopRightRadius: sw(30),
      borderTopLeftRadius: sw(30),
      marginTop: sw(-30),
      paddingHorizontal: sw(20),
      paddingTop: sw(36),
      paddingBottom: sw(90),
    },
    stopItemWholeview: {
      backgroundColor: theme.colors.keyboardTextBlock,
      marginBottom: sw(12),
      borderRadius: sw(10),
      padding: sw(18),
    },
    stopItemview: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: sw(18),
    },
    stopItemText: {
      flex: 1,
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.para),
      color: theme.colors.text,
      paddingLeft: sw(12),
    },
    stopLeftItemView: {
      // flex: 1,
      flexDirection: 'row',
      marginRight: sw(8),
    },
    etaText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.para),
      color: theme.colors.secondary,
      paddingHorizontal: sw(18),
      paddingTop: sw(12),
    },
  });
};
