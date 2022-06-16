import DeviceInfo from 'react-native-device-info';

import { sf, sw } from './Mixins';
import { FONT_SIZE_ADJUSTMENT_RATIO } from '~src/constants/Constant';

// FONT FAMILY (We must use font family instead of weight to control the thickness of the font)
export const FONT_FAMILY_100 = 'Mulish-ExtraLight'; //FontWeight = 100
export const FONT_FAMILY_200 = 'Mulish-ExtraLight'; //FontWeight = 200
export const FONT_FAMILY_300 = 'Mulish-Light'; //FontWeight = 300
export const FONT_FAMILY_400 = 'Mulish-Regular'; // FontWeight = 400
export const FONT_FAMILY_500 = 'Mulish-Medium'; //FontWeight = 500
export const FONT_FAMILY_600 = 'Mulish-SemiBold'; //FontWeight = 600
export const FONT_FAMILY_700 = 'Mulish-Bold'; // FontWeight = 700
export const FONT_FAMILY_800 = 'Mulish-ExtraBold'; // FontWeight = 800
export const FONT_FAMILY_900 = 'Mulish-Black'; // FontWeight = 900

//Retrieve the device manufacturer / brand, in order to apply style fix specifically.
const deviceBrand = DeviceInfo.getBrand();

const getTextStyle = (fontFamily, fontSizeInDp = 18, lineHeightInDp = 0) => {
  let lineHeight =
    FONT_SIZE_ADJUSTMENT_RATIO[deviceBrand.toLowerCase()] !== undefined
      ? Number(
          (
            sw(lineHeightInDp) *
            FONT_SIZE_ADJUSTMENT_RATIO[deviceBrand.toLowerCase()]
          ).toFixed(0),
        )
      : sw(lineHeightInDp);
  if (lineHeightInDp === 0) {
    lineHeight = getLineHeight(fontSizeInDp);
  }
  return {
    fontFamily: fontFamily,
    fontSize: sf(fontSizeInDp),
    lineHeight: lineHeight,
  };
};

export const ts = getTextStyle;

const getLineHeight = (fontSizeInDp) => {
  let multiplier = 1.2;
  let lineHeight = sw(Math.round(fontSizeInDp * multiplier));
  return lineHeight;
};

export const getTextExtraPadding = (fontSizeInDp) => {
  return {
    paddingVertical: sw(fontSizeInDp * 0.375),
  };
};
