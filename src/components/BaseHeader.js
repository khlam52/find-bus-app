import React from 'react';

import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  NativeModules,
  Platform,
} from 'react-native';

import AppFocusAwareStatusBar from './AppFocusAwareStatusBar';
import { withAllContext } from '~src/contexts/withAllContext';
import { Typography } from '~src/styles';
import { sw } from '~src/styles/Mixins';
import CommonUtil from '~src/utils/CommonUtil';

const BaseHeader = ({
  title,
  titleContainerStyle,
  leftElement,
  leftElementContainerStyle,
  rightElement,
  rightElementContainerStyle,
  appTheme: {
    theme: { settings: theme },
  },
  isTransparent,
  additionalStyle,
  textColor,
  ...props
}) => {
  console.log('BaseHeader -> isTransparent : ', isTransparent);
  const styles = getStyle(theme, { ...props, isTransparent: isTransparent });
  const headerBackgroundColor =
    isTransparent === true
      ? '#FFFFFF00'
      : props.backgroundColor
      ? props.backgroundColor
      : theme.colors.supportive;

  const headerTextColor = '#EFF0F2';
  return (
    <View
      onLayout={props.onLayoutEvent !== undefined ? props.onLayoutEvent : null}>
      {!isTransparent && (
        <AppFocusAwareStatusBar
          barStyle={
            CommonUtil.getColorBrightness(headerBackgroundColor) > 150
              ? 'dark-content'
              : 'light-content'
          }
          backgroundColor={
            props.backgroundColor
              ? props.backgroundColor
              : theme.colors.supportive
          }
          animated={false}
        />
      )}
      <SafeAreaView
        style={[
          styles.safeArea,
          {
            backgroundColor: headerBackgroundColor,
          },
        ]}>
        <View
          style={{
            ...styles.container,
            ...(additionalStyle !== undefined ? additionalStyle : null),
          }}>
          <View
            style={[
              styles.sideElementContainer,
              styles.sideLeft,
              leftElementContainerStyle ? leftElementContainerStyle : null,
            ]}>
            {leftElement ? leftElement : null}
          </View>
          <View
            style={{
              ...styles.titleContainer,
              ...(titleContainerStyle ? titleContainerStyle : null),
            }}>
            <Text
              adjustsFontSizeToFit={true}
              numberOfLines={props.secondTitle ? 1 : 2}
              ellipsizeMode={'tail'}
              style={styles.titleText}>
              {title ? title : ''}
            </Text>
            {props.secondTitle ? (
              <Text
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={[
                  styles.subTitleText,
                  {
                    color: theme.colors.text500,
                  },
                ]}>
                {props.secondTitle ? props.secondTitle : ''}
              </Text>
            ) : null}
          </View>
          <View
            style={[
              styles.sideElementContainer,
              styles.sideRight,
              rightElementContainerStyle ? rightElementContainerStyle : null,
            ]}>
            {rightElement ? rightElement : null}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};
const getStyle = (theme, props) => {
  const { StatusBarManager } = NativeModules;
  return StyleSheet.create({
    safeArea: {},
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: sw(12),
      paddingBottom: sw(18),
      ...(!props.isTransparent && Platform.OS === 'android'
        ? { marginTop: StatusBarManager.HEIGHT }
        : null),
    },
    titleContainer: {
      flex: 1,
      paddingHorizontal: sw(16),
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleText: {
      ...Typography.ts(theme.fonts.weight.bold, theme.fonts.size.para),
      textAlign: 'center',
      color: '#EFF0F2',
    },
    subTitleText: {
      ...Typography.ts(theme.fonts.weight.regular, theme.fonts.size.desc),
      textAlign: 'center',
    },
    sideElementContainer: {
      minWidth: sw(theme.spacings.s5),
    },
    sideLeft: {
      marginLeft: sw(theme.spacings.s3),
      alignItems: 'flex-start',
    },
    sideRight: {
      marginRight: sw(theme.spacings.s3),
      alignItems: 'flex-end',
    },
  });
};

export default withAllContext(BaseHeader);
