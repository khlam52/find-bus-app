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

function getKMBRouteStopList(route, bound, serviceType) {
  let direction = bound === 'I' ? 'inbound' : 'outbound';
  return getRequest(
    AppConfig.KMB_GET_ROUTE_STOP_LIST_URL +
      `${route}/${direction}/${serviceType}`,
  );
}

function getKMBStopLatLongDetail(stopId) {
  return getRequest(AppConfig.KMB_GET_STOP_LAT_LONG_DETAIL_URL + stopId);
}

function getKMBStopThreeETA(stopId) {
  return getRequest(AppConfig.KMB_GET_STOP_THREE_ETA_URL + stopId);
}

export default {
  getKMBAllRouteList,
  getKMBRouteStopList,
  getKMBStopLatLongDetail,
  getKMBStopThreeETA,
};
