export const LANG_EN = 'en';
export const LANG_TC = 'zh-Hant';
export const LANG_SC = 'zh-Hans';
export const APP_STORE_URL = 'https://itunes.apple.com/hk/app/XXX/id123455';
export const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=package_name';

export const APP_TO_SERVER_LANG_MAP = {
  en: 'en_US',
  'zh-Hant': 'zh_HK',
  'zh-Hans': 'zh_CN',
};

export const SERVER_TO_APP_LANG_MAP = {
  en: 'en',
  'zh-Hant': 'zhhk',
  'zh-Hans': 'zhcn',
};

export const FONT_SIZE_ADJUSTMENT_RATIO = {
  huawei: 0.764,
};

export const SERVER_ERR_CODE_MSG_MAP = [
  {
    errCode: ['ERR_1', 'ERR_0'],
    errMsg: 'ERR_1',
  },
  {
    errCode: ['ERR_2'],
    errMsg: 'ERR_2',
  },
];

export const THEME_NAME = {
  DARK: 'DARK',
  LIGHT: 'LIGHT',
};

// Used in LoginScreen for normal login and biometric enable
export const LOGIN_TYPE = {
  USER_NAME_PASSWORD: 'USER_NAME_PASSWORD',
};

// Used in OtpScreen for handling different screen navigation
export const OTP_FROM_TYPE = {
  FROM_USERNAME_PASSWORD_LOGIN: 'FROM_USERNAME_PASSWORD_LOGIN',
  NONE: 'NONE',
};

// Login Sequence
export const LOGIN_SEQUENCE = {
  OTP: 'OTP',
  TNC: 'TNC',
  CHANGE_PW: 'CHANGE_PW',
  TAB_SCREEN: 'TAB_SCREEN',
};
