import { AppConfig } from '~src/config';
// import AppState from '~src/services/AppState';
import MockService from '~src/services/MockService';
import HttpConnector from '~src/utils/HttpConnector';

function postRequest(apiURL, params = {}) {
  // console.log('ApiService -> postRequest -> apiURL:' + apiURL);
  if (AppConfig.IS_API_MOCK_DATA === 'true') {
    return Promise.resolve(MockService.getMockData(apiURL, params));
  }
  return HttpConnector.postRequest(apiURL, params);
}

// Remark: should be a private function
function getRequest(apiURL, params = {}) {
  // console.log('ApiService -> getRequest -> apiURL:' + apiURL);
  if (AppConfig.IS_API_MOCK_DATA === 'true') {
    return Promise.resolve(MockService.getMockData(apiURL));
  }
  return HttpConnector.getRequest(apiURL, params);
}

function getAppProfile() {
  return getRequest(AppConfig.APP_PROFILE_URL);
}

function getAccessToken() {
  if (AppConfig.IS_API_MOCK_DATA === 'true') {
    let accessToken = 'abcdefg';
    // AppState.setAccessToken('abcdefg');
    return Promise.resolve({ accessToken });
  }
  return HttpConnector.getAccessToken();
}

function getActiveCriticalNotice() {
  return getRequest(AppConfig.ACTIVE_CRITICAL_NOTICE_URL);
}

function getImportantNoticeList() {
  return getRequest(AppConfig.IMPORTANT_NOTICE_LIST_URL);
}

function getStaticDataUpdateHistoryList() {
  return getRequest(AppConfig.STATIC_DATA_UPDATE_HISTORY_LIST_URL);
}

function getStaticDataVersionHistoryList() {
  return getRequest(AppConfig.STATIC_DATA_VERSION_HISTORY_LIST_URL);
}

function getTermsAndConditionsByVersion(tncVersion) {
  let params = {
    tncVersion,
  };
  return postRequest(AppConfig.TERMS_AND_CONDITIONS_VERSIONS_QUERY_URL, params);
}

function getMobileAppTermsAndConditionsByVersion(tncVersion) {
  let params = {
    tncVersion,
  };
  return postRequest(
    AppConfig.MOBILE_APP_TERMS_AND_CONDITIONS_VERSIONS_QUERY_URL,
    params,
  );
}

function getBranchList() {
  let params = {};
  return postRequest(AppConfig.BRANCH_LIST_URL, params);
}

function getFaqList() {
  let params = {};
  return postRequest(AppConfig.FAQ_LIST_URL, params);
}

function getSmsOtp() {
  let params = {};
  return postRequest(AppConfig.GENERATE_SMS_OPT_URL, params);
}

function verifySmsOtp(authReqId, otp, bffSessionId, userId) {
  let params = {
    authReqId,
    otp,
    bffSessionId,
    scope: 'XXX',
    userId,
  };
  return postRequest(AppConfig.VERIFY_SMS_OPT_URL, params);
}

export default {
  getAppProfile,
  getAccessToken,
  getActiveCriticalNotice,
  getImportantNoticeList,
  getStaticDataUpdateHistoryList,
  getStaticDataVersionHistoryList,
  getTermsAndConditionsByVersion,
  getMobileAppTermsAndConditionsByVersion,
  getSmsOtp,
  verifySmsOtp,
  getBranchList,
  getFaqList,
};
