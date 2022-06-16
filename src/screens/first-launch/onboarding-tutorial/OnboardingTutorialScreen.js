/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from 'react';

import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Pagination } from 'react-native-snap-carousel';

import { AppSecondaryButton } from '~src/components/AppButton';
import AppCarousel from '~src/components/AppCarousel';
import useLocalization from '~src/contexts/i18n';
import useAppTheme from '~src/contexts/theme';
import Route from '~src/navigations/Route';
import StorageService from '~src/services/StorageService';
import { Typography } from '~src/styles';
import { sh, sw, WINDOW_WIDTH } from '~src/styles/Mixins';

export default function OnboardingTutorialScreen({ navigation, route }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);
  const { t } = useLocalization();
  const insets = useSafeAreaInsets();
  const {
    theme: { settings: theme },
  } = useAppTheme();
  const styles = getStyle(insets, theme);
  useEffect(() => {}, []);

  const carouselItems = [
    {
      // image: TutorialSlide1Img,
      title: t('SCREENS.TUTORIAL_SCREEN.SLIDE_1.TITLE'),
      desc: t('SCREENS.TUTORIAL_SCREEN.SLIDE_1.DESC'),
    },
    {
      // image: TutorialSlide1Img,
      title: t('SCREENS.TUTORIAL_SCREEN.SLIDE_2.TITLE'),
      desc: t('SCREENS.TUTORIAL_SCREEN.SLIDE_2.DESC'),
    },
    {
      // image: TutorialSlide1Img,
      title: t('SCREENS.TUTORIAL_SCREEN.SLIDE_3.TITLE'),
      desc: t('SCREENS.TUTORIAL_SCREEN.SLIDE_3.DESC'),
    },
  ];

  async function finishTutorial() {
    navigation.navigate(Route.MAIN_STACK, { screen: Route.LANDING_SCREEN });
    StorageService.setIsFirstLaunch(false);
  }

  const renderTutorialItem = ({ item }) => {
    // const SVGImage = item.image;
    return (
      <View style={styles.slideContainer}>
        <View style={{ alignSelf: 'center' }}>
          {/* <SVGImage width={sw(202)} height={sw(202)} /> */}
        </View>
        <Text
          style={{
            marginTop: sw(theme.spacings.s7),
            ...styles.slideTitleText,
          }}>
          {item.title}
        </Text>
        <Text
          style={{
            marginTop: sw(theme.spacings.s2),
            ...styles.slideDescText,
          }}>
          {item.desc}
        </Text>
      </View>
    );
  };

  const snappedItem = (currentIndex) => {
    setActiveIndex(currentIndex);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.underLayerLt }}>
      <View style={{ flex: 129 }} />
      <View style={{ height: sw(544) }}>
        <AppCarousel
          ref={carouselRef}
          style={styles.carouselView}
          layout={'default'}
          data={carouselItems}
          sliderWidth={WINDOW_WIDTH}
          itemWidth={WINDOW_WIDTH}
          itemRenderer={renderTutorialItem}
          onSnapToItem={(index) => snappedItem(index)}
        />
      </View>
      <View
        style={{
          flex: 223,
          ...styles.controlContainer,
        }}>
        <View>
          <Pagination
            dotsLength={carouselItems.length}
            activeDotIndex={activeIndex}
            containerStyle={styles.paginationContainerStyle}
            dotStyle={[styles.dotActiveStyle]}
            dotContainerStyle={styles.dotContainerStyle}
            inactiveDotStyle={[styles.dotInActiveStyle]}
            inactiveDotOpacity={1}
            inactiveDotScale={1}
          />
        </View>
        <AppSecondaryButton
          text={t('SCREENS.TUTORIAL_SCREEN.START_BTN')}
          onPress={finishTutorial}
          disabled={false}
          paddingHorizontal={20}
        />
      </View>
    </SafeAreaView>
  );
}

const getStyle = (insets, theme) => {
  return StyleSheet.create({
    container: {
      padding: 6,
      marginTop: sh(24) + insets.top,
      backgroundColor: theme.colors.underLayerLt,
    },
    controlContainer: {
      paddingTop: sh(49),
      paddingHorizontal: sw(theme.spacings.s3),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    carouselView: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      backgroundColor: '#FFFFFF00',
    },
    slideContainer: {
      paddingHorizontal: sw(theme.spacings.s4),
      flex: 1,
    },
    slideTitleText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.h2),
      color: theme.colors.primary,
    },
    slideDescText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.lead),
      color: theme.colors.text60,
    },
    dotActiveStyle: {
      width: sw(39),
      height: sw(13),
      borderRadius: sw(13 / 2),
      backgroundColor: theme.colors.supportive,
    },
    dotInActiveStyle: {
      width: sw(13),
      height: sw(13),
      borderRadius: sw(13 / 2),
      backgroundColor: theme.colors.text22,
    },
    dotContainerStyle: {
      marginHorizontal: sw(theme.spacings.s1),
    },
    paginationContainerStyle: {
      justifyContent: 'flex-start',
      paddingHorizontal: 0,
      paddingVertical: 0,
      height: sw(56),
    },
  });
};
