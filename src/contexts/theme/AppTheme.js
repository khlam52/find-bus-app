import { THEME_NAME } from '~src/constants/Constant';
import { default as ColorPalette } from '~src/contexts/theme/AppColorPalette';
import { Typography } from '~src/styles';

// const AppScreenThemesAvailability = {
//   DEFAULT: [THEME_NAME.DARK],
//   TAB_ACCOUNT_OVERVIEW_SCREEN: [THEME_NAME.DARK, THEME_NAME.LIGHT],
// };

const baseComponentDisplays = {};

const baseSpacings = {
  s1: 8,
  s2: 16,
  s3: 24,
  s4: 32,
  s5: 40,
  s6: 48,
  s7: 56,
};

const baseRadiuses = {
  container: 48,
  item: 24,
  corner: 16,
  badge: 8,
};

// Info System

const darkColorScheme = {
  background: ColorPalette.blue.background,
  primary: ColorPalette.blue.primary,
  secondary: ColorPalette.blue.secondary,
  yellow: ColorPalette.yellow.dark,
  text: ColorPalette.grey.text,
  heart: ColorPalette.red.dark,
  keyboardBackground: ColorPalette.blue.keyboardBackground,
  keyboardTextBlock: ColorPalette.blue.keyboardTextBlock,
  tabBackground: ColorPalette.blue.keyboardTextBlock,
  tabOnfocus: ColorPalette.blue.primary,
  tabOutFocus: ColorPalette.blue.tabOutFocus,
};

const lightColorScheme = {
  background: ColorPalette.grey.text,
  primary: ColorPalette.white.raw,
  secondary: ColorPalette.blue.secondaryLight,
  yellow: ColorPalette.yellow.light,
  text: ColorPalette.blue.primary,
  heart: ColorPalette.red.light,
  keyboardBackground: ColorPalette.grey.keyboardBackgroundLight,
  keyboardTextBlock: ColorPalette.white.raw,
  tabBackground: ColorPalette.grey.tabBackgroundLight,
  tabOnfocus: ColorPalette.blue.secondaryLight,
  tabOutFocus: ColorPalette.blue.tabOutFocusLight,
};

const baseFonts = {
  weight: {
    thin: Typography.FONT_FAMILY_100,
    extralight: Typography.FONT_FAMILY_200,
    light: Typography.FONT_FAMILY_300,
    regular: Typography.FONT_FAMILY_400,
    medium: Typography.FONT_FAMILY_500,
    semibold: Typography.FONT_FAMILY_600,
    bold: Typography.FONT_FAMILY_700,
    extrabold: Typography.FONT_FAMILY_800,
    black: Typography.FONT_FAMILY_900,
  },
  size: {
    note2: 14,
    note1: 15,
    desc: 16,
    para: 18,
    lead: 20,
    ///
    h5: 20,
    h4: 24,
    h3: 28,
    h2: 32,
    h1: 48,
  },
};

const AppDarkTheme = {
  name: THEME_NAME.DARK,
  settings: {
    roundness: baseRadiuses,
    spacings: baseSpacings,
    colors: darkColorScheme,
    fonts: baseFonts,
    animation: { scale: 1 },
  },
  displays: baseComponentDisplays,
};

const AppLightTheme = {
  name: THEME_NAME.LIGHT,
  settings: {
    roundness: baseRadiuses,
    spacings: baseSpacings,
    colors: lightColorScheme,
    fonts: {
      weight: { ...baseFonts.weight },
      size: {
        ...baseFonts.size,
        ...{
          note2: 18,
          note1: 19,
          desc: 20,
          para: 24,
          lead: 28,
          ///
          h5: 28,
          h4: 32,
          h3: 38,
          h2: 44,
          h1: 64,
        },
      },
      // size: { ...baseFonts.size, ...{ note2: 20 } },
      // Above is an example to demostrate how we can only revise specific and required values from base settings.
    },
    animation: { scale: 1 },
  },
  displays: baseComponentDisplays,
};

export { AppDarkTheme, AppLightTheme };
