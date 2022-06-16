import React from 'react';

import { View } from 'react-native';

import { Colors } from '~src/styles';

const AppBackgroundView = ({ style, ...props }) => {
  const backgroundColor = style
    ? style.backgroundColor
      ? style.backgroundColor
      : Colors.BACKGROUND_COLOR
    : Colors.BACKGROUND_COLOR;

  /* ===== Default Status Bar - will be overrided by individual self-define status bar style ====*/

  return [
    <View
      style={[
        { ...style },
        {
          backgroundColor: backgroundColor,
        },
      ]}
      {...props}
      key={1}
    />,
  ];
};

export default AppBackgroundView;
