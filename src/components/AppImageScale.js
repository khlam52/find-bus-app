import React, { useState, useEffect, useRef } from 'react';

import {
  ImageBackground,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';

import { Colors } from '~src/styles';
import { sw } from '~src/styles/Mixins';
import CommonUtil from '~src/utils/CommonUtil';

const defaultCornerRadius = { rt: 0, rb: 0, lb: 0, lt: 0 };

const AppImageScale = ({ imgWidth, imgSource, ...props }) => {
  const IMAGE_DEFAULT_HEIGHT = 100;
  const [imageLoaded, setImageLoaded] = useState(false);
  let opacityAnim = useRef(new Animated.Value(1)).current;
  const [newImgSize, setNewImgSize] = useState({
    height:
      props.imgHeight !== undefined && props.imgHeight > 0
        ? props.imgHeight
        : IMAGE_DEFAULT_HEIGHT,
    width: imgWidth,
  });
  const styles = getStyle(props);
  let cornerRadius = props.cornerRadius
    ? props.cornerRadius
    : defaultCornerRadius;

  useEffect(() => {
    if (props.imgHeight === undefined && props.imgHeight <= 0)
      getNewImageSize();
  }, []);

  //---- Image calculate
  const getNewImageSize = () => {
    CommonUtil.getImgScaleHightSize(imgSource, imgWidth).then(
      (newImageSize) => {
        setNewImgSize(newImageSize);
      },
    );
  };

  //---- Image Animation
  let fadeInImage = () => {
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const imageError = (err) => {
    console.log('AppImage -> imageError');
    console.log(err);
  };

  return (
    <ImageBackground
      source={{ uri: imgSource }}
      onError={imageError}
      onLoad={() => {
        setImageLoaded(true);
        fadeInImage();
      }}
      imageStyle={[
        {
          borderRadius: sw(cornerRadius.lt),
          borderTopLeftRadius: sw(cornerRadius.lt),
          borderTopRightRadius: sw(cornerRadius.rt),
          borderBottomRightRadius: sw(cornerRadius.rb),
          borderBottomLeftRadius: sw(cornerRadius.lb),
        },
      ]}
      style={[
        props.forwardStyle,
        {
          width: newImgSize.width,
          height: newImgSize.height,
          borderTopLeftRadius: sw(cornerRadius.lt),
          borderTopRightRadius: sw(cornerRadius.rt),
          borderBottomRightRadius: sw(cornerRadius.rb),
          borderBottomLeftRadius: sw(cornerRadius.lb),
          overflow: 'hidden',
        },
      ]}
      {...props}>
      {opacityAnim && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: opacityAnim,
            },
          ]}
        />
      )}

      {!imageLoaded ? (
        <ActivityIndicator style={styles.loading} color={'#000'} />
      ) : null}
    </ImageBackground>
  );
};
export default AppImageScale;

const getStyle = (props) => {
  let overlayBgColor = props.overlayBgColor
    ? props.overlayBgColor
    : Colors.SPINNER_OVERLAY;
  let cornerRadius =
    props.cornerRadius !== undefined
      ? { ...defaultCornerRadius, ...props.cornerRadius }
      : defaultCornerRadius;
  return StyleSheet.create({
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    overlay: {
      backgroundColor: overlayBgColor,
      width: '100%',
      height: '100%',
      position: 'absolute',
      borderTopLeftRadius: sw(cornerRadius.lt),
      borderTopRightRadius: sw(cornerRadius.rt),
      borderBottomRightRadius: sw(cornerRadius.rb),
      borderBottomLeftRadius: sw(cornerRadius.lb),
    },
  });
};
