import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { View } from 'react-native';
import Carousel from 'react-native-snap-carousel';

import useAppTheme from '~src/contexts/theme';
import { sw } from '~src/styles/Mixins';

const AppCarousel = React.forwardRef(
  (
    {
      layout,
      data,
      sliderWidth,
      itemWidth,
      activeSlideAlignment,
      inactiveSlideScale,
      layoutCardOffset,
      itemRenderer,
      onSnapToItem,
      scrollEventThrottle,
      tagName,
      containerStyle,
      carouselContainerStyle,
      style,
      ...props
    },
    carouselRef,
  ) => {
    const [startOffsetX, setStartOffsetX] = useState(0);
    const [endOffsetX, setEndOffsetX] = useState(0);
    const {
      theme: { settings: theme },
    } = useAppTheme();

    const cLayout = layout ? layout : 'default';
    const cData = data ? data : [];
    const cOffset = layoutCardOffset ? layoutCardOffset : 0;
    const cScrollEventThrottle = scrollEventThrottle ? scrollEventThrottle : 16;
    const sContainerWidth = sliderWidth ? sliderWidth : sw(414);
    const sWidth = itemWidth ? itemWidth : sw(414);
    const sInactiveScale = inactiveSlideScale ? inactiveSlideScale : 1;
    const sRenderer = itemRenderer
      ? itemRenderer
      : () => {
          return <View />;
        };
    const sOnSnap = onSnapToItem
      ? onSnapToItem
      : (index) => {
          console.log('Carousel On Snap at -> ', index);
        };
    const cContainerStyle = containerStyle
      ? containerStyle
      : {
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
        };

    const defaultBackgroundColor = style
      ? style.backgroundColor
        ? style.backgroundColor
        : theme.colors.background
      : theme.colors.background;

    const beginScroll = ({ nativeEvent }) => {
      setStartOffsetX(nativeEvent.contentOffset.x);
      console.log(
        'AppCarousel -> beginScroll -> nativeEvent.contentOffset : ',
        nativeEvent.contentOffset,
      );
    };

    const endScroll = ({ nativeEvent }) => {
      setEndOffsetX(nativeEvent.contentOffset.x);
      console.log(
        'AppCarousel -> endScroll -> nativeEvent.contentOffset : ',
        nativeEvent.contentOffset,
      );
    };

    return (
      <View
        style={[
          cContainerStyle,
          {
            backgroundColor: defaultBackgroundColor,
          },
        ]}>
        <Carousel
          layout={cLayout}
          ref={carouselRef}
          data={cData}
          sliderWidth={sContainerWidth}
          itemWidth={sWidth}
          inactiveSlideScale={sInactiveScale}
          layoutCardOffset={cOffset}
          renderItem={sRenderer}
          onSnapToItem={sOnSnap}
          onScrollBeginDrag={beginScroll}
          onScrollEndDrag={endScroll}
          onMomentumScrollEnd={endScroll}
          activeSlideAlignment={
            activeSlideAlignment ? activeSlideAlignment : 'center'
          }
          containerCustomStyle={
            carouselContainerStyle ? carouselContainerStyle : {}
          }
          inactiveSlideOpacity={1}
          scrollEventThrottle={cScrollEventThrottle}
        />
      </View>
    );
  },
);

export default AppCarousel;

let requiredPropType = {
  data: PropTypes.any.isRequired,
  itemRenderer: PropTypes.any.isRequired,
};
AppCarousel.propTypes = requiredPropType;
