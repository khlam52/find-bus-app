import _ from 'lodash';

import { store } from '~src/contexts/store/Store';
import StorageService from '~src/services/StorageService';

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

export default {
  setFavouriteListFunc,
  deleteFavouriteListFunc,
  isFavouriteItem,
};
