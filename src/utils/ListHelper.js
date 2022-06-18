import _ from 'lodash';

import { store } from '~src/contexts/store/Store';
import StorageService from '~src/services/StorageService';

export const KEYBOARD_LIST = [
  ...new Array(9).fill().map((item, index) => {
    return index + 1;
  }),
  'Clear',
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

    console.log('isFavouriteItem haveList:', haveList);
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

export default {
  setFavouriteListFunc,
  deleteFavouriteListFunc,
  isFavouriteItem,
  updateSearchList,
  getSearchKeyboardItemEnable,
  getSearchAlplabetList,
};
