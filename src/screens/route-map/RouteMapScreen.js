import React, { useEffect, useRef, useState } from 'react';

import Geolocation from '@react-native-community/geolocation';
import { useStoreState } from 'easy-peasy';
import _ from 'lodash';
import moment from 'moment';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { RESULTS } from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  BackIcon,
  DarkMapNotSelectedStopIcon,
  DarkMapSelectedStopIcon,
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

  const [currentLat, setCurrentLat] = useState(22.280499);
  const [currentLng, setCurrentLng] = useState(114.157612);
  const [isGotGeoLoc, setIsGotGeoLoc] = useState(false);

  const [selectedStop, setSelectedStop] = useState(null);

  const markerListRef = useRef([]);
  const [stopETAList, setStopETAList] = useState(null);

  const allStopDetailList = useStoreState(
    (state) => state.user.allStopDetailList,
  );

  useEffect(() => {
    console.log('routeDetailListhhh:', routeDetailList);
    getCurrentLocation();
    getRestructuredList();
    console.log('markerList:', markerListRef);
  }, []);

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
  };

  const getCurrentLocation = async () => {
    let result = await PermissionUtil.requestLocationPermission();
    if (result === RESULTS.GRANTED) {
      Geolocation.getCurrentPosition(
        async (position) => {
          setCurrentLat(position.coords.latitude);
          setCurrentLng(position.coords.longitude);
          setIsGotGeoLoc(true);

          // zoomToMap(position.coords.latitude, position.coords.longitude);
        },
        (error) => console.log(error.message),
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 },
      );
    }
  };

  const getDestStationName = (item) => {
    return locale === 'en' ? item.name_en : item.name_tc;
  };

  const onStopItemPressed = async (item) => {
    setSelectedStop(item);

    let stopEtaList = await ListHelper.getKMBStopThreeETAList(
      item.stop,
      item.route,
    );
    setStopETAList(stopEtaList);
    console.log('stopEtaList:', stopEtaList);
  };

  const getDiffETAMinutes = (eta) => {
    let currentTime = new Date();
    console.log(
      'currentTimecurrentTime:',
      moment(eta).diff(moment(currentTime), 'minutes'),
    );
    return moment(eta).diff(moment(currentTime), 'minutes');
  };

  return (
    <View style={styles.container}>
      <BaseHeader
        title={routeTitle + ' To ' + stationTitle}
        leftElement={
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}>
            <BackIcon fill={theme.colors.text} />
          </Pressable>
        }
      />
      <MapView
        style={styles.mapView}
        initialRegion={{
          latitude: currentLat,
          longitude: currentLng,
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
              // onMakerClick(marker, index);
            }}
            // image={{
            //   uri:
            //     selectedBranch === marker
            //       ? 'marker_focus_icon'
            //       : 'marker_icon',
            // }}
          />
        ))}
      </MapView>
      <ScrollView style={styles.stopListView}>
        {markerListRef.current.map((item, index) => {
          return (
            <AppPressable
              disableDelayPress={true}
              key={index}
              style={styles.stopItemWholeview}
              onPress={() => {
                onStopItemPressed(item);
              }}>
              <View style={styles.stopItemview}>
                <View style={styles.stopLeftItremView}>
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

                {selectedStop === item ? (
                  <ArrowUpIcon fill={theme.colors.secondary} />
                ) : (
                  <ArrowDownIcon fill={theme.colors.secondary} />
                )}
              </View>
              {selectedStop === item &&
                stopETAList &&
                stopETAList.map((etaItem, etaIndex) => {
                  return (
                    getDiffETAMinutes(etaItem.eta) > 0 && (
                      <View key={etaIndex}>
                        <Text style={styles.etaText}>
                          {'- ' + getDiffETAMinutes(etaItem.eta) + ' mins'}
                        </Text>
                      </View>
                    )
                  );
                })}
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
    },
    stopItemText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.para),
      color: theme.colors.text,
      paddingLeft: sw(12),
    },
    stopLeftItremView: {
      flexDirection: 'row',
    },
    etaText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.para),
      color: theme.colors.secondary,
      paddingHorizontal: sw(18),
      paddingTop: sw(12),
    },
  });
};
