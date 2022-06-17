import _ from 'lodash';

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
const updateHeartIconFunc = async (
  item,
  favouriteList,
  setIsHeartIconPressed,
  isHeartIconPressedRef,
) => {
  if (favouriteList && favouriteList.length > 0) {
    favouriteList.map((favItem, favIndex) => {
      if (
        favItem.route === item.route &&
        favItem.dest_en === item.dest_en &&
        favItem.orig_en === item.orig_en &&
        favItem.service_type === item.service_type
      ) {
        setIsHeartIconPressed(true);
        isHeartIconPressedRef.current = true;
      }
    });
  }
};

export default {
  setFavouriteListFunc,
  deleteFavouriteListFunc,
  updateHeartIconFunc,
};
