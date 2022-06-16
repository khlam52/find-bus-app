import React from 'react';

import BaseButton from '~src/components/BaseButton';
import { THEME_NAME } from '~src/constants/Constant';
import useAppTheme from '~src/contexts/theme';
import { withAllContext } from '~src/contexts/withAllContext';
import { sw } from '~src/styles/Mixins';

const AppButton = (props) => {
  const {
    themeSwitched: { settings: theme, name: themeName },
  } = useAppTheme();
  // console.log('AppButton (SUB) -> props : ', props);
  return (
    <BaseButton
      btnTextFontSize={
        themeName === THEME_NAME.ZOOMED ? theme.fonts.size.lead : null
      }
      isRound={true}
      btnHeight={sw(45)}
      {...props}
    />
  );
};

export default withAllContext(AppButton);

export const AppSecondaryButton = withAllContext((props) => {
  const {
    appTheme: {
      theme: { settings: theme },
    },
  } = props;
  // console.log('AppSecondaryButton (SUB) -> props : ', props);
  return (
    <AppButton
      btnTextColor={theme.colors.textOnSecondary}
      backgroundColor={theme.colors.secondary}
      {...props}
    />
  );
});

export const AppButtonOutlined = withAllContext((props) => {
  const {
    appTheme: {
      themeSwitched: { settings: theme },
    },
  } = props;
  // console.log('AppSecondaryButton (SUB) -> props : ', props);
  return (
    <AppButton
      btnTextColor={theme.colors.supportive}
      borderColor={theme.colors.supportive}
      btnTextFontSize={theme.fonts.size.lead}
      isTransparent={true}
      borderWidth={sw(1) >= 1 ? sw(1) : 1}
      {...props}
    />
  );
});
