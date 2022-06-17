import { action } from 'easy-peasy';

let initalAllBusRouteList = {
  bound: null,
  dest_en: null,
  dest_sc: null,
  dest_tc: null,
  orig_en: null,
  orig_sc: null,
  orig_tc: null,
  route: null,
  service_type: null,
};

let initFavouriteList = [];

export default {
  isLoggedIn: false,
  allBusRouteList: initalAllBusRouteList,
  favouriteList: initFavouriteList,

  setAllBusRouteList: action((state, payload) => {
    state.allBusRouteList = payload;
    console.log('allBusRouteList ->', state.allBusRouteList);
  }),

  setFavouriteList: action((state, payload) => {
    state.favouriteList = payload;
    console.log('favouriteList ->', state.favouriteList);
  }),
};
