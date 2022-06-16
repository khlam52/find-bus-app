import env from 'react-native-config';

const config = {
  env: env.ENV,
  isEnableCertPinning: env.IS_ENABLE_CERT_PINNING,
  isEnableClientCertPinning: env.IS_ENABLE_CLIENT_CERT_PINNING,
  isEnablePromon: env.IS_ENABLE_PROMON === 'true' ? true : false,
  clientCertName: env.CLIENT_CERT_NAME,
  clientCertPw: env.CLIENT_CERT_PW,
  version: {
    ios: env.IOS_APP_VERSION,
    android: env.AOS_APP_VERSION,
  },
  build_num: {
    ios: env.IOS_BUILD_VERSION,
    android: env.AOS_BUILD_VERSION,
  },
  api: {
    isMockData: env.IS_MOCK_DATA,
    host: env.API_HOST,
    clientId: env.CLIENT_ID,
    timeout: 30000,
  },
  idle: {
    postLoginIdleWarningMin: parseInt(env.POST_LOGIN_IDLE_WARNING_MINUTE, 10),
    postLoginIdleForegroundLogoutMin: parseInt(
      env.POST_LOGIN_IDLE_FOREGROUND_LOGOUT_MINUTE,
      10,
    ),
    postLoginIdleBackgroundLogoutMin: parseInt(
      env.POST_LOGIN_IDLE_BACKGROUND_LOGOUT_MINUTE,
      10,
    ),
  },
  linking: {
    universalLink: env.UNIVERSAL_LINK,
  },
};

export const ENV = config.env;
export const API_HOST = config.api.host;
export const CLIENT_ID = config.api.clientId;
export const API_TIMEOUT = config.api.timeout;
export const IS_API_MOCK_DATA = config.api.isMockData;
export const IOS_APP_VERSION = config.version.ios;
export const AOS_APP_VERSION = config.version.android;
export const IOS_APP_BUILD_NUM = config.build_num.ios;
export const AOS_APP_BUILD_NUM = config.build_num.android;
export const IS_ENABLE_CERT_PINNING = config.isEnableCertPinning;
export const IS_ENABLE_CLIENT_CERT_PINNING = config.isEnableClientCertPinning;
export const CLIENT_CERT_NAME = config.clientCertName;
export const CLIENT_CERT_PW = config.clientCertPw;
export const IS_ENABLE_PROMON = config.isEnablePromon;

// Idle timer
export const POST_LOGIN_IDLE_WARNING_MINUTE =
  config.idle.postLoginIdleWarningMin;
export const POST_LOGIN_IDLE_FOREGROUND_LOGOUT_MINUTE =
  config.idle.postLoginIdleForegroundLogoutMin;
export const POST_LOGIN_IDLE_BACKGROUND_LOGOUT_MINUTE =
  config.idle.postLoginIdleBackgroundLogoutMin;

// Universal Link
export const UNIVERSAL_LINK = config.linking.universalLink;

// API URL
export const API_ENDPOINT =
  config.api.host +
  (ENV !== 'prod' ? '/XXX-p2' : '') +
  (ENV === 'sit' || ENV === 'dev' ? '-sit' : '');

export const API_CHANNEL_ENDPOINT =
  config.api.host +
  '/XXX/channel-xxx-bff' +
  (ENV !== 'prod' ? '-p2' : '') +
  (ENV === 'sit' || ENV === 'dev' ? '-sit' : '');

// Access Token
export const ACCESS_TOKEN_URL = API_ENDPOINT + '/refresh';
export const APP_PROFILE_URL = API_CHANNEL_ENDPOINT + '/bff/XXX/appProfile';

// Static Data
export const ACTIVE_CRITICAL_NOTICE_URL =
  API_CHANNEL_ENDPOINT + '/bff/XXX/activeCriticalNotice';
export const IMPORTANT_NOTICE_LIST_URL =
  API_CHANNEL_ENDPOINT + '/bff/XXX/importantNoticeList';
export const STATIC_DATA_UPDATE_HISTORY_LIST_URL =
  API_CHANNEL_ENDPOINT + '/bff/XXX/staticDataUpdateHistory';
export const STATIC_DATA_VERSION_HISTORY_LIST_URL =
  API_CHANNEL_ENDPOINT + '/auth/staticDataVersionHistory';
export const TERMS_AND_CONDITIONS_VERSIONS_QUERY_URL =
  API_CHANNEL_ENDPOINT + '/auth/termsAndConditionsVersion/query';
export const MOBILE_APP_TERMS_AND_CONDITIONS_VERSIONS_QUERY_URL =
  API_CHANNEL_ENDPOINT + '/auth/mobileAppTnCVersion/query';

export const BRANCH_LIST_URL = API_CHANNEL_ENDPOINT + '/bff/XXX/branchList';
export const FAQ_LIST_URL = API_CHANNEL_ENDPOINT + '/bff/XXX/faqList';

//SMS
export const GENERATE_SMS_OPT_URL =
  API_CHANNEL_ENDPOINT + '/auth/xxxLogon/smsOtp/generate';
export const VERIFY_SMS_OPT_URL =
  API_CHANNEL_ENDPOINT + '/auth/xxxLogon/smsOtp/verify';
