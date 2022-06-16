import NetInfo from '@react-native-community/netinfo';
import i18n from 'i18n-js';
// import { sha256 } from 'js-sha256';
import _ from 'lodash';
import Moment from 'moment';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import 'react-native-get-random-values';
import { fetch } from 'react-native-ssl-pinning';

import { AppConfig } from '~src/config';
import { APP_TO_SERVER_LANG_MAP } from '~src/constants/Constant';
import {
  currentAccessToken,
  currentSessionID,
  isLoggedIn,
  store,
} from '~src/contexts/store/Store';

async function getAccessToken() {
  console.log('HttpConnector -> getAccessToken');
  let method = 'POST';
  let requestURL = AppConfig.REFRESH_ACCESS_TOKEN_URL;
  let timeout = AppConfig.API_TIMEOUT;
  let requestData = { mobileSerial: DeviceInfo.getUniqueId() };

  let response = await makeRequest(
    method,
    requestURL,
    requestData,
    timeout,
    false,
  );
  let jsonResponse;
  try {
    jsonResponse = JSON.parse(response);
  } catch (error) {
    jsonResponse = response;
  }
  if (jsonResponse && jsonResponse.access_token) {
    store.getActions().appState.setAccessToken(jsonResponse.access_token);
    return Promise.resolve(jsonResponse);
  } else {
    return Promise.reject(jsonResponse);
  }
}

const makeRequest = async (
  method,
  requestURL,
  requestData,
  timeout = AppConfig.API_TIMEOUT,
  isFileUpload = false,
) => {
  if (AppConfig.ENV !== 'prod' && isFileUpload === false) {
    console.log(
      'HttpConnector -> makeRequest -> ' +
        method +
        ' requestURL: ' +
        requestURL +
        ' requestData: ' +
        (requestData ? JSON.stringify(requestData) : ''),
    );
  }
  let networkState = await NetInfo.fetch();
  if (
    networkState.isInternetReachable === false &&
    AppConfig.ENV !== 'dev' &&
    AppConfig.ENV !== 'sit' &&
    AppConfig.ENV !== 'uat'
  ) {
    return Promise.reject('FER_100_001');
  }

  let certPinningMode =
    AppConfig.IS_ENABLE_CERT_PINNING === 'true' ? 'pinned' : 'none';
  let clientCertPinningMode =
    AppConfig.IS_ENABLE_CLIENT_CERT_PINNING === 'true' ? 'pinned' : 'none';
  let clientCertName = AppConfig.CLIENT_CERT_NAME;
  let clientCertPw = AppConfig.CLIENT_CERT_PW;
  let commonHeader = prepareHeader();
  if (requestURL === AppConfig.POST_TRANSACTION_APPROVAL) {
    // commonHeader['X-APPROVAL-CHECKSUM'] = prepareCheckSum(requestData);
  }

  if (requestURL === AppConfig.ACCOUNT_GET_HISTORIES_URL) {
    timeout = 60000;
  }

  //Reset SessionID and Access Token after Prepare Logout call
  if (requestURL === AppConfig.LOGOUT_URL) {
    store.getActions().appState.setSessionID(null);
    store.getActions().appState.setAccessToken(null);
  }

  try {
    let requestBody;
    let response;
    if (method === 'POST') {
      requestBody = JSON.stringify(requestData);
      response = await fetch(requestURL, {
        method: method,
        timeoutInterval: timeout, // milliseconds,
        certPinningMode: certPinningMode,
        clientCertPinningMode: clientCertPinningMode,
        clientCertName: clientCertName,
        clientCertPw: clientCertPw,
        body: requestBody,
        headers: commonHeader,
        isFileUpload: isFileUpload,
      });
    } else if (method === 'GET') {
      if (requestData) {
        requestURL = requestURL.concat('?');
        Object.keys(requestData).forEach(function (key) {
          // console.table('Key : ' + key + ', Value : ' + requestData[key]);
          requestURL = requestURL.concat(key + '=' + requestData[key] + '&');
        });
        requestURL = requestURL.substring(0, requestURL.length - 1);
      }

      let encodeUrl = encodeURI(requestURL);
      response = await fetch(encodeUrl, {
        method: 'GET',
        timeoutInterval: timeout, // milliseconds,
        certPinningMode: certPinningMode,
        clientCertPinningMode: clientCertPinningMode,
        clientCertName: clientCertName,
        clientCertPw: clientCertPw,
        headers: commonHeader,
      });
    }

    if (response) {
      console.log(
        'HttpConnector -> makeRequest -> response received: ',
        response,
      );

      let jsonResponse = response;
      if (!(typeof response === 'object')) {
        jsonResponse = JSON.parse(response);
      }

      // check if any thing needs to be set in return header
      if (jsonResponse.headers) {
        setValueFromResponseHeader(jsonResponse.headers);
      }

      let bodyString = JSON.parse(jsonResponse.bodyString);
      console.log(
        'HttpConnector -> makeRequest -> response bodyString:',
        bodyString,
      );

      // format not valid, maybe calling another domain api
      if (!bodyString.result) {
        if (bodyString.data) {
          return Promise.resolve(bodyString.data);
        }
        return Promise.resolve(bodyString);
      }

      if (
        bodyString.result.code === 'SUCCESS' ||
        bodyString.result.code === 'success' ||
        bodyString.result.code === '200'
      ) {
        // apic access token
        if (bodyString.data && bodyString.data.access_token)
          store
            .getActions()
            .appState.setAccessToken(bodyString.data.access_token);

        return Promise.resolve(bodyString.data ? bodyString.data : {});
      } else if (
        isLoggedIn &&
        (bodyString.result.code === 'CHN-00101' ||
          bodyString.code === 'CHN-00101')
      ) {
        return makeRequest(
          method,
          requestURL,
          requestData,
          timeout,
          isFileUpload,
        );
      }
    } else {
      console.log('HttpConnector -> makeRequest -> response is null');
      let errorResult = {
        result: {
          code: 'API_RESPONSE_NULL',
        },
      };
      return Promise.reject(errorResult);
    }
  } catch (error) {
    console.log(
      'HttpConnector -> makeRequest -> catch error: ',
      JSON.stringify(error),
    );
    if (error.headers) {
      setValueFromResponseHeader(error.headers);
    }

    error.requestId = commonHeader['X-RequestId'];

    if (_.has(error, 'bodyString')) {
      try {
        error.bodyString = JSON.parse(error.bodyString);
      } catch (e) {
        e.bodyString = e.bodyString;
      }
    }
    if (
      _.has(error, 'bodyString') &&
      _.get(error, 'bodyString.httpCode', '') === '401'
    ) {
      try {
        await getAccessToken();
        return makeRequest(
          method,
          requestURL,
          requestData,
          timeout,
          isFileUpload,
        );
      } catch (e) {
        return Promise.reject(e);
      }
    } else if (
      isLoggedIn &&
      (_.get(error, 'bodyString.result.code', '') === 'CHN-00101' ||
        _.get(error, 'bodyString.code', '') === 'CHN-00101')
    ) {
      return makeRequest(
        method,
        requestURL,
        requestData,
        timeout,
        isFileUpload,
      );
    } else {
      return Promise.reject(error);
    }
  }
};

async function getRequest(
  requestURL,
  requestData,
  timeout = AppConfig.API_TIMEOUT,
) {
  return await makeRequest('GET', requestURL, requestData, timeout);
}

async function postRequest(
  requestURL,
  requestData,
  timeout = AppConfig.API_TIMEOUT,
  isFileUpload = false,
) {
  return await makeRequest(
    'POST',
    requestURL,
    requestData,
    timeout,
    isFileUpload,
  );
}

function setValueFromResponseHeader(header) {
  if (header['X-SESSION-ID']) {
    store.getActions().appState.setSessionID(header['X-SESSION-ID']);
  }
}

function getRequestAppLangHeader() {
  let locale = i18n.locale;
  let headerAppLang = APP_TO_SERVER_LANG_MAP[locale];
  if (headerAppLang) {
    return headerAppLang;
  }
  return '';
}

// function prepareCheckSum(requestBody) {
//   if (preApprovalSalt) {
//     let sha256Value = sha256(preApprovalSalt + JSON.stringify(requestBody));
//     return sha256Value;
//   }
//   return '';
// }

function prepareHeader() {
  let currentAppVersion = DeviceInfo.getVersion(); // iOS: "1.0", Android: "1.0"
  let osVersion = DeviceInfo.getSystemVersion(); //iOS: "11.0", Android: "7.1.1"
  let deviceModel = DeviceInfo.getDeviceId(); //iOS: "iPhone7,2", Android: "goldfish"
  let platform = Platform.OS;
  let uniqueDeviceId = DeviceInfo.getUniqueId();

  let headerJson = {
    // 'Access-Control-Allow-Origin': '*',
    'X-IBM-Client-Id': AppConfig.CLIENT_ID,
    'X-MOBILE-APP-VERSION': currentAppVersion,
    'X-MOBILE-DEVICE-PLATFORM': platform,
    'X-MOBILE-DEVICE-OS-VERSION': osVersion,
    'X-MOBILE-DEVICE-MODEL': deviceModel,
    'X-MOBILE-APP-LANGUAGE': getRequestAppLangHeader(),
    'X-MOBILE-DEVICE-ID': uniqueDeviceId,
    Authorization: currentAccessToken
      ? 'Bearer ' + currentAccessToken
      : 'Bearer ',
  };

  if (currentSessionID) {
    headerJson['X-SESSION-ID'] = currentSessionID;
  }

  if (AppConfig.ENV !== 'prod') {
    headerJson['X-RequestId'] =
      uniqueDeviceId.replace('-', '').substring(0, 10) +
      Moment().format('HHmmss');
  }

  headerJson['content-type'] = 'application/json; charset=utf-8';

  console.log('HttpConnector -> prepareHeader: ', headerJson);
  return headerJson;
}

export default { getRequest, postRequest };
