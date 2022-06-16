import { THEME_NAME } from '~src/constants/Constant';
import { default as ColorPalette } from '~src/contexts/theme/AppColorPalette';
import { Typography } from '~src/styles';

// const AppScreenThemesAvailability = {
//   DEFAULT: [THEME_NAME.DEFAULT],
//   TAB_ACCOUNT_OVERVIEW_SCREEN: [THEME_NAME.DEFAULT, THEME_NAME.ZOOMED],
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
//// Checking & Saving
//// Fixed Deposit
//// Loans & Credit Card

const baseColorScheme = {
  border: 'transparent', // RN
  borderFocus: 'transparent',
  inputFocus: '#FFFFFF',
  inputBlur: '#DFEAF5',
  buttonText: '#ffffff',
  card: 'rgb(255, 255, 255)', // RN
  disabled: 'rgba(0, 0, 0, 0.26)',
  separator: ColorPalette.uiBlue.bt100,
  separatorOverUnderlayer: ColorPalette.appBlue.raw + '1A',

  // ↓↓↓ Text Color System ↓↓↓
  text: '#000000',
  text950: ColorPalette.grey.bt400,
  text900: ColorPalette.grey.bt900,
  text800: ColorPalette.grey.bt700,
  text700: ColorPalette.grey.bt700,
  text600: ColorPalette.grey.bt500,
  text500: ColorPalette.grey.bt500,
  text400: ColorPalette.grey.bt400,
  text300: ColorPalette.grey.bt200,
  text200: ColorPalette.grey.bt200,
  text100: ColorPalette.grey.bt200,
  textAppBlue: ColorPalette.appBlue.raw,
  textPositive: ColorPalette.green.raw,
  textDimmed: '#C3C8CD',
  textOnPale: ColorPalette.uiBlue.bt800,
  textOnPaleLight: ColorPalette.uiBlue.bt400,
  textOnPrimary: ColorPalette.white.raw,
  onPrimary: ColorPalette.white.raw,
  textOnSecondary: ColorPalette.appBlue.raw,
  textOnSupportive: '#ffffff',
  inputText: '#000000',
  onBackground: '#000000',
  onSurface: '#000000',
  underText950: ColorPalette.grey.tl50,

  // ↓↓↓ Background Color System ↓↓↓
  backdrop: 'rgba(0, 0, 0, 0.5)',
  surface: ColorPalette.white.raw,
  background: ColorPalette.white.raw,
  underlayerLt: '#E5E5E5',
  underlayerDk: ColorPalette.paleBlue.dimmer,
  underlayerPale: ColorPalette.paleBlue.bt100,
  underlayer: ColorPalette.paleBlue.raw,

  // ↓↓↓ Function/Info Color System ↓↓↓
  positive: ColorPalette.green.raw,
  underPositive: ColorPalette.green.light,
  alert: ColorPalette.red.raw,
  alertSoft: ColorPalette.red.bt100,
  underAlert: ColorPalette.red.lightSoft,
  alertUnderline: ColorPalette.red.light,
  error: ColorPalette.pinkRed.raw,

  // ↓↓↓ Component Color System ↓↓↓
  primary: ColorPalette.appRed.lightWarm,
  primaryDimmed: ColorPalette.appRed.lightSoft,
  overPrimary: ColorPalette.oceanBlue.tl80,
  overPrimaryPressed: ColorPalette.oceanBlue.tl50,
  underPrimary: ColorPalette.oceanBlue.light,
  secondary: ColorPalette.white.raw,
  secondaryDimmed: ColorPalette.white.tl50,
  supportive: '#357CB6',
  placeholder: '#0B234B99',
  placeholderFocus: '#0B234B99',
  notification: '#f50057',
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

const AppDefaultTheme = {
  name: THEME_NAME.DEFAULT,
  settings: {
    roundness: baseRadiuses,
    spacings: baseSpacings,
    colors: baseColorScheme,
    fonts: baseFonts,
    animation: { scale: 1 },
  },
  displays: baseComponentDisplays,
};

const AppZoomedTheme = {
  name: THEME_NAME.ZOOMED,
  settings: {
    roundness: baseRadiuses,
    spacings: baseSpacings,
    colors: {
      ...baseColorScheme,
      primary: ColorPalette.appBlue.raw,
      underPrimary: ColorPalette.appBlue.light,
    },
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

export { AppDefaultTheme, AppZoomedTheme };
