// THEMES
export const PRIMARY = '#1F2A54';
export const SECONDARY = '#23BCB0';

// COLORS
export const BLACK = '#000000';
export const BLUE = '#0000FF';
export const CARDINAL_PINK = '#920783';
export const DOWNRIVER = '#0B234B';
export const GREEN = '#00FF00';
export const LIMA = '#7ED321';
export const PRUSSIAN_BLUE = '#132A4A';
export const RED = '#FF0000';
export const RONCHI = '#E8B54C';
export const VALENCIA = '#DA3636';
export const WHITE = '#FFFFFF';
export const IOS_BLUE = '#3988DB';

// ACTIONS
export const SUCCESS = '#54C360';
export const WARNING = '#ffae00';
export const ALERT = '#cc1111';

// GRAYSCALE
export const GRAY_LIGHTEST = '#F3F4F5';
export const GRAY_LIGHTER = '#EEEEEE';
export const GRAY_LIGHT = '#D3D3D3';
export const GRAY_MEDIUM = '#cacaca';
export const GRAY_MEDIUM_DARK = '#AEAEAE';
export const GRAY_DARK = '#8a8a8a';
export const GRAY_DARKER = '#7a7a7a';
export const GRAY = '#5a5a5a';
export const SCORPION = '#565656';
export const SPINNER_OVERLAY = '#E5E5E5FF';

// STATUS
export const STATUS_SUCCESS = '#34BB7A';
export const STATUS_WARNING = '#FF9B00';
export const STATUS_FAILED = '#FF3030';

// LIGHT TRANSPARENT
export const LIGHT_PRIMARY = '#577AAB';

// App COLOR
export const BACKGROUND_COLOR = '#FFFFFF';
//AppInput
export const COLOR_APP_INPUT = {
  PLACEHOLDER_COLOR: '#333333',
  BORDER_FOCUS_COLOR: '#1F1F1F',
  ERROR_COLOR: '#CF6679',
  LABEL_COLOR: '#F8E8E8',
  TIN_COLOR: '#000000',
};

export function opacity(color, percentage) {
  var outPrint =
    percentage < 1
      ? color + (percentage * 255).toString(16).substr(0, 2)
      : color + ((percentage / 100) * 255).toString(16).substr(0, 2);
  return outPrint;
}
