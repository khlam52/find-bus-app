import { AppConfig } from '~src/config';
// import AppState from '~src/services/AppState';

import HttpConnector from '~src/utils/HttpConnector';

function postRequest(apiURL, params = {}) {
  // console.log('ApiService -> postRequest -> apiURL:' + apiURL);
  // if (AppConfig.IS_API_MOCK_DATA === 'true') {
  //   return Promise.resolve(MockService.getMockData(apiURL, params));
  // }
  return HttpConnector.postRequest(apiURL, params);
}

// Remark: should be a private function
function getRequest(apiURL, params = {}) {
  // console.log('ApiService -> getRequest -> apiURL:' + apiURL);
  // if (AppConfig.IS_API_MOCK_DATA === 'true') {
  //   return Promise.resolve(MockService.getMockData(apiURL));
  // }
  return HttpConnector.getRequest(apiURL, params);
}

// KMB
function getKMBAllRouteList() {
  return getRequest(AppConfig.KMB_GET_ALL_ROUTE_LIST_URL);
}

export default {
  getKMBAllRouteList,
};
