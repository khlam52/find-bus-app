import activeCriticalNotice from '~src/assets/dummy-json/activeCriticalNotice.json';
import appProfile from '~src/assets/dummy-json/appProfile.json';
import branchList from '~src/assets/dummy-json/branch.json';
import faqList from '~src/assets/dummy-json/faq.json';
import generateSmsOtp from '~src/assets/dummy-json/generateSmsOtp.json';
import importantNoticeList from '~src/assets/dummy-json/importantNoticeList.json';
import mobileAppTermsAndConditionsVersionQuery from '~src/assets/dummy-json/mobileAppTermsAndConditionsVersionQuery.json';
import staticDataUpdateHistoryList from '~src/assets/dummy-json/staticDataUpdateHistoryList.json';
import staticDataVersionHistoryList from '~src/assets/dummy-json/staticDataVersionHistoryList.json';
import termsAndConditionsVersionQuery from '~src/assets/dummy-json/termsAndConditionsVersionQuery.json';
import verifySmsOtp from '~src/assets/dummy-json/verifySmsOtp.json';
import { AppConfig } from '~src/config';

function getMockData(apiURL, params) {
  switch (apiURL) {
    case AppConfig.APP_PROFILE_URL:
      return appProfile;
    case AppConfig.ACTIVE_CRITICAL_NOTICE_URL:
      return activeCriticalNotice;
    case AppConfig.IMPORTANT_NOTICE_LIST_URL:
      return importantNoticeList;
    case AppConfig.STATIC_DATA_UPDATE_HISTORY_LIST_URL:
      return staticDataUpdateHistoryList;
    case AppConfig.STATIC_DATA_VERSION_HISTORY_LIST_URL:
      return staticDataVersionHistoryList;
    case AppConfig.TERMS_AND_CONDITIONS_VERSIONS_QUERY_URL:
      return termsAndConditionsVersionQuery;
    case AppConfig.MOBILE_APP_TERMS_AND_CONDITIONS_VERSIONS_QUERY_URL:
      return mobileAppTermsAndConditionsVersionQuery;
    case AppConfig.GENERATE_SMS_OPT_URL:
      return generateSmsOtp;
    case AppConfig.VERIFY_SMS_OPT_URL:
      return verifySmsOtp;
    case AppConfig.BRANCH_LIST_URL:
      return branchList;
    case AppConfig.FAQ_LIST_URL:
      return faqList;
    default:
      return {};
  }
}

export default { getMockData };
