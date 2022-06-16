import React from 'react';

import { BackIcon } from '~src/assets/images';
import AppPressable from '~src/components/AppPressable';
import BaseHeader from '~src/components/BaseHeader';
import { withAllContext } from '~src/contexts/withAllContext';
import RootNavigation from '~src/navigations/RootNavigation';
import { sw } from '~src/styles/Mixins';

// Header with back button only
// 1. blue background with white button
// 2. transparent background with black button
// default back action is navigation.goBack()

const BackHeader = ({
  title,
  isTransparent,
  onBackButtonPressed,
  textColor,
  appTheme: {
    theme: { settings: theme },
  },
  ...props
}) => {
  const backBtnBGColor = 'transparent';
  const headerTextColor = theme.colors.text;
  const navBarBGColor = isTransparent ? 'transparent' : theme.colors.secondary;

  return (
    <BaseHeader
      title={title}
      backgroundColor={navBarBGColor}
      leftElement={
        <AppPressable
          style={{
            backgroundColor: backBtnBGColor,
            borderRadius: sw(theme.roundness.corner),
          }}
          onPress={
            onBackButtonPressed ? onBackButtonPressed : RootNavigation.back
          }>
          <BackIcon width={sw(28)} height={sw(28)} fill={headerTextColor} />
        </AppPressable>
      }
      {...(textColor !== null
        ? {
            textColor: textColor,
          }
        : { textColor: headerTextColor })}
      {...props}
    />
  );
};

BackHeader.defaultProps = {
  title: '',
  isTransparent: false,
  onBackButtonPressed: null,
  isAccountDetailHeaderZoomMode: false,
  textColor: null,
};

export default withAllContext(BackHeader);
