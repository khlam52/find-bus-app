import I18n from 'i18n-js';
import _ from 'lodash';

import { store } from '~src/contexts/store/Store';
import ApiService from '~src/services/ApiService';
import StorageService from '~src/services/StorageService';

export const KEYBOARD_LIST = [
  ...new Array(9).fill().map((item, index) => {
    return index + 1;
  }),
  I18n.t('SCREENS.SEARCH_SCREEN.CLEAR'),
  0,
  'Close',
];

export const ALPHABET_LIST = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Set Favourite List Item
const setFavouriteListFunc = async (item, favouriteList, setFavouriteList) => {
  let newFavouriteList = [...favouriteList];
  newFavouriteList.push(item);
  console.log('newFavouriteList:', newFavouriteList);
  setFavouriteList(newFavouriteList);
  StorageService.setFavouriteList(newFavouriteList);
};

// Delete Favourite List Item
const deleteFavouriteListFunc = async (
  item,
  favouriteList,
  setFavouriteList,
) => {
  let newFavouriteList = [...favouriteList];
  newFavouriteList = _.reject(newFavouriteList, {
    route: item.route,
    dest_en: item.dest_en,
    orig_en: item.orig_en,
    service_type: item.service_type,
  });
  console.log('delete newFavouriteList:', newFavouriteList);
  setFavouriteList(newFavouriteList);
  StorageService.setFavouriteList(newFavouriteList);
};

// Set Heart Icon Fill In Logic
const isFavouriteItem = (item) => {
  let favouriteList = store.getState().user.favouriteList;
  if (favouriteList && favouriteList.length > 0) {
    let haveList = [];

    haveList = _.filter(favouriteList, {
      route: item.route,
      dest_en: item.dest_en,
      orig_en: item.orig_en,
      service_type: item.service_type,
    });

    if (haveList.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const getRouteList = (searchRoute) => {
  let allRouteList = store.getState().user.allBusRouteList;

  if (!searchRoute) {
    return _.map(allRouteList, (item) => {
      return item.route;
    });
  } else {
    return _.map(allRouteList, (item) => {
      if (String(item.route).includes(searchRoute)) {
        return item.route;
      }
    });
  }
};

// Check Number Keyboard Item Enable
const getSearchKeyboardItemEnable = (searchRoute, keyBoardItem) => {
  let route = searchRoute + keyBoardItem;
  return getRouteList(route).some((element) => {
    return String(element).startsWith(route);
  });
};

// Update Alphabet List
const getSearchAlplabetList = (searchRoute) => {
  let alphabetList = [];

  ALPHABET_LIST.map((item) => {
    let route = searchRoute + item;

    getRouteList(route).map((element) => {
      if (String(element).startsWith(route)) {
        alphabetList.push(item);
      }
    });
  });

  return Array.from(new Set(alphabetList));
};

// Get Update Search List
const updateSearchList = (searchRoute) => {
  let allRouteList = store.getState().user.allBusRouteList;
  if (searchRoute) {
    return _.filter(allRouteList, (item) => {
      return String(item.route).startsWith(searchRoute);
    });
  }
  return allRouteList;
};

// Call Map Api
const getRouteStopList = async (
  route,
  bound,
  serviceType,
  showLoading,
  hideLoading,
) => {
  let restructuredList = [];
  showLoading();
  try {
    let routeStopListResponse = await ApiService.getKMBRouteStopList(
      route,
      bound,
      serviceType,
    );
    console.log('routeStopListResponse:', routeStopListResponse.data);
    if (routeStopListResponse.data) {
      restructuredList = routeStopListResponse.data;
    }

    hideLoading();
  } catch (error) {
    console.log('getKMBAllRouteList error ->', error);
    hideLoading();
  }
  return restructuredList;
};

const getKMBStopLatLongDetailList = async (stopId) => {
  let list = [];
  try {
    let getKMBStopLatLongDetailResponse = await ApiService.getKMBStopLatLongDetail(
      stopId,
    );
    if (getKMBStopLatLongDetailResponse.data) {
      list = getKMBStopLatLongDetailResponse.data;
    }
  } catch (error) {
    console.log('getKMBStopLatLongDetailResponse error ->', error);
  }
  return list;
};

const getKMBStopThreeETAList = async (stopId, route) => {
  let list = [];
  try {
    let getKMBStopThreeETAListResponse = await ApiService.getKMBStopThreeETA(
      stopId,
    );
    if (getKMBStopThreeETAListResponse.data) {
      list = _.filter(getKMBStopThreeETAListResponse.data, {
        route: route,
      });
    }
  } catch (error) {
    console.log('getKMBStopThreeETAListResponse error ->', error);
  }
  return list;
};

export default {
  setFavouriteListFunc,
  deleteFavouriteListFunc,
  isFavouriteItem,
  updateSearchList,
  getSearchKeyboardItemEnable,
  getSearchAlplabetList,
  getRouteStopList,
  getKMBStopLatLongDetailList,
  getKMBStopThreeETAList,
};
