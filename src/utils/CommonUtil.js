import React from 'react';

import i18n from 'i18n-js';
import moment from 'moment';
import { Image, Linking, Platform } from 'react-native';
import RNCommonUtil from 'react-native-common-util';

import 'moment/locale/zh-hk';
import 'moment/locale/zh-cn';

import AlertHelper from './AlertHelper';
import { SystemUpdateIcon, WarningIcon } from '~src/assets/images';
import { CURRENCY_MAP, LANG_EN, LANG_TC } from '~src/constants/Constant';
import { store } from '~src/contexts/store/Store';
import { sw } from '~src/styles/Mixins';

const numberToCurrencyFormatter = (number, fixedPoint, isHidden = false) => {
  if (isHidden) {
    return '****';
  }
  let value = 0;
  if (number !== null && number !== undefined) {
    if (typeof number === 'number' && !isNaN(number)) {
      value = number
        .toFixed(fixedPoint)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    } else {
      value = number;
    }
  } else {
    console.log('CommonUtil -> numberToCurrencyFormatter -> error');
  }
  return value;
};

const getDisplayCurrency = (t, rawCurrency) => {
  let currency = rawCurrency;
  let displayCurrency = CURRENCY_MAP.includes(currency)
    ? t('SCREENS.FXRATE.' + currency)
    : currency;

  return displayCurrency;
};

const getImgScaleHightSize = (imageUri, defineWidth) => {
  const IMAGE_DEFAULT_HEIGHT = 100;
  const newImageSize = { height: IMAGE_DEFAULT_HEIGHT, width: defineWidth };

  return new Promise((resolve, reject) => {
    Image.getSize(
      imageUri,
      (imgWidth, imgHeight) => {
        newImageSize.height = (imgHeight * defineWidth) / imgWidth;
        resolve(newImageSize);
      },
      (error) => {
        console.error(`Couldn't get the image size: ${error.message}`);
        resolve(newImageSize);
      },
    );
  });
};

const callNumber = (phone) => {
  console.log('ComonUtil -> callNumber -> ', phone);
  let phoneNumber = phone;
  if (Platform.OS !== 'android') {
    phoneNumber = `telprompt:${phone}`;
  } else {
    phoneNumber = `tel:${phone}`;
  }
  const alertIcon = (
    <WarningIcon
      width={sw(60)}
      height={sw(69)}
      // fill={'#D9000D'}
      // opacity="0.4"
    />
  );
  Linking.canOpenURL(phoneNumber)
    .then((supported) => {
      if (!supported) {
        AlertHelper.showErrorAlert('Phone number is not available', null);
      } else {
        return Linking.openURL(phoneNumber);
      }
    })
    .catch((err) => {
      console.log('ComonUtil -> callNumber -> error:', err);
      AlertHelper.showAlertWithOneButton(
        alertIcon,
        i18n.t('ALERT.APP_TITLE'),
        i18n.t('ERROR.NOT_SUPPORT_CLICK_TO_DIAL_MSG'),
        i18n.t('BUTTONS.OK'),
        null,
      );
    });
};

const openURL = (url) => {
  const openUrl = () => {
    try {
      Linking.openURL(url);
    } catch (error) {
      console.log('openURL error:', error);
    }
  };
  const alertIcon = (
    <WarningIcon
      width={sw(60)}
      height={sw(69)}
      // fill={'#D9000D'}
      // opacity="0.4"
    />
  );

  AlertHelper.showAlert(
    alertIcon,
    i18n.t('ALERT.APP_TITLE'),
    i18n.t('ERROR.OPEN_URL_WARNING'),
    i18n.t('BUTTONS.YES'),
    i18n.t('BUTTONS.NO'),
    openUrl,
  );
};

const contactEmail = () => {
  Linking.openURL(
    'mailto:contact@abc.com.hk?subject=' +
      i18n.t('SCREENS.MORE_SCREEN.CONTACT_US'),
  ).catch((err) => {
    console.log('ComonUtil -> contactEmail -> error:', err);
    const alertIcon = (
      <WarningIcon
        width={sw(60)}
        height={sw(69)}
        // fill={'#D9000D'}
        // opacity="0.4"
      />
    );
    AlertHelper.showAlertWithOneButton(
      alertIcon,
      i18n.t('ALERT.APP_TITLE'),
      i18n.t('ERROR.NOT_SUPPORT_MAILTO_FUNCTION_MSG'),
      i18n.t('BUTTONS.OK'),
      null,
    );
  });
};

const maskPhoneNumber = (areaCode, phoneNumber) => {
  let maskedPhoneNumber = '';
  if (phoneNumber) {
    if (areaCode === '86' || areaCode === 86) {
      let lastChar = phoneNumber.substring(phoneNumber.length - 7);
      maskedPhoneNumber = '****' + lastChar;
    } else {
      let lastChar = phoneNumber.substring(phoneNumber.length - 4);
      maskedPhoneNumber = '****' + lastChar;
    }
  }
  return `+${areaCode} ${maskedPhoneNumber}`;
};

const maskEmail = (emailAddress) => {
  let replacement = emailAddress
    .replace(/^(\S)(\S+)(@\S+)$/g, '$2')
    .replace(/\S/g, '*');
  return emailAddress.replace(/^(\S)(\S+)(@\S+)$/g, '$1' + replacement + '$3');
};

const compareDay = (today, dayFrom) => {
  console.log('//==+=*= compareDay =*=+==//');
  const todayData = moment(today);
  const dayFromData = moment(dayFrom);
  console.log('==+=*= todayData =*=+==');
  console.log(todayData);
  console.log('==+=*= dayFromData =*=+==');
  console.log(dayFromData);
  const dayDiff = todayData.diff(dayFromData, 'days');
  console.log('==+=*= result : dayDiff =*=+==');
  console.log(dayDiff);
  return dayDiff;
};

const showCommonDateFormat = (date) => {
  let local = 'en';
  let dateFormat = 'DD MMM YYYY';
  if (i18n.locale === 'zh-Hant' || i18n.locale === 'zh-Hans') {
    local = 'zh-hk';
    dateFormat = 'LL';
  }
  return getMomentDate(date, null, dateFormat, local);
};

const showMMYYYDateFormat = (date) => {
  let local = 'en';
  let dateFormat = 'MMM YYYY';
  if (i18n.locale === 'zh-Hant' || i18n.locale === 'zh-Hans') {
    local = 'zh-hk';
    dateFormat = 'YYYY年MMM';
  }
  return getMomentDate(date, null, dateFormat, local);
};

const showDateWithTimeFormat = (date) => {
  let local = 'en';
  let dateFormat = 'DD MMM YYYY HH:mm:ss';
  if (i18n.locale === 'zh-Hant' || i18n.locale === 'zh-Hans') {
    local = 'zh-hk';
    dateFormat = 'LL HH:mm:ss';
  }
  return getMomentDate(date, null, dateFormat, local);
};

const showTimeFormat = (date) => {
  let local = 'en';
  let dateFormat = 'HH:mm:ss';
  if (i18n.locale === 'zh-Hant' || i18n.locale === 'zh-Hans') {
    local = 'zh-hk';
    dateFormat = 'HH:mm:ss';
  }
  return getMomentDate(date, null, dateFormat, local);
};

const getMomentDate = (
  date,
  preSetDateFormat = null,
  dateFormat = 'DD/MM/YYYY',
  local = 'en',
) => {
  let returnDate = 'N/A';

  if (date && preSetDateFormat) {
    returnDate =
      moment(date, preSetDateFormat).isValid() === true
        ? moment(date, preSetDateFormat)
            .utcOffset('+0800')
            .locale(local)
            .format(dateFormat)
        : 'N/A';
  } else if (date && !preSetDateFormat) {
    returnDate =
      moment(date).isValid() === true
        ? moment(date).utcOffset('+0800').locale(local).format(dateFormat)
        : 'N/A';
  }
  if (returnDate === 'Invalid date') {
    returnDate = 'N/A';
  }

  return returnDate;
};

const getMomentToday = () => {
  return moment().utcOffset('+0800');
};

const getMomentYesterday = () => {
  return moment().utcOffset('+0800').add(-1, 'days');
};

const getMomentTomorrow = () => {
  return moment().utcOffset('+0800').add(1, 'days');
};

const getMomentDaysAfter = (_after) => {
  return moment().utcOffset('+0800').add(_after, 'days');
};

const getMomentDaysWithin = (day = 6, _start = getMomentToday(), _end) => {
  let result = [],
    formatStr = 'DD.MM.YYYY HH:mm';
  if (_end === undefined) return result;
  if (_end.isSameOrBefore(_start)) return result;
  if (!moment.isMoment(_end) && !moment.isDate(_end)) return result;
  let now = _start.day(day);
  let startStr = moment(_start).format(formatStr);
  let endStr = moment(_end).format(formatStr);
  let nowStr = moment(_start).day(day).format(formatStr);
  if (now.isBefore(_start)) {
    now.add(7, 'd');
    startStr = moment(startStr, formatStr).add(7, 'd').format(formatStr);
  }
  while (
    moment(nowStr, formatStr).isBetween(
      moment(startStr, formatStr).subtract(1, 'days'),
      moment(endStr, formatStr),
    )
  ) {
    // console.log(`C %%%%%%%%% now.clone() to push => `, now.clone());
    result.push(moment(nowStr, formatStr));
    nowStr = moment(nowStr, formatStr).add(7, 'd').format(formatStr);
  }
  return result;
};

const getMomentDateRange = (_start, _end, _poolToExclude) => {
  let result = [],
    formatStr = 'DD.MM.YYYY HH:mm';
  console.log('_start : ', _start);
  console.log('_end : ', _end);
  if (_end === undefined || _start === undefined) return result;
  if (
    (!moment.isMoment(_start) && !moment.isDate(_start)) ||
    (!moment.isMoment(_end) && !moment.isDate(_end))
  )
    return result;
  if (_end.isSameOrBefore(_start)) return result;
  let tar = _start;
  let startStr = moment(_start).format(formatStr);
  let endStr = moment(_end).format(formatStr);
  let tarStr = startStr;

  while (
    moment(tarStr, formatStr).isBetween(
      moment(startStr, formatStr).subtract(1, 'days'),
      moment(endStr, formatStr).add(1, 'days'),
    )
  ) {
    result.push(moment(tarStr, formatStr));
    tarStr = moment(tarStr, formatStr).add(1, 'd').format(formatStr);
  }

  return result;
};

const getColorBrightness = (_colorCode) => {
  if (
    _colorCode === undefined ||
    _colorCode === null ||
    _colorCode.indexOf('#') < 0 ||
    _colorCode.length < 7 ||
    (_colorCode.length == 9 && _colorCode.substring(8, 9) === '00')
  )
    return false;
  const colorCode = _colorCode.substring(1, 7); // strip #
  const rgb = parseInt(colorCode, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
  return luma;
};

const isArrayEmpty = (data) => {
  return (
    data === null ||
    data === undefined ||
    data.length === 0 ||
    data.size == 0 ||
    Number.isNaN(data)
  );
};

const parseURLParams = (url) => {
  let urlArray = url.split('?');
  let returnArray = {};
  if (urlArray.length >= 1) {
    let paramsStr = urlArray[1];
    let paramArray = paramsStr.split('&');
    paramArray.forEach((element) => {
      let eachElementArray = element.split('=');
      returnArray[eachElementArray[0]] = eachElementArray[1];
    });
  }
  return returnArray;
};

const exitApp = () => {
  console.log('CommonUtil -> exitApp: Platform.OS', Platform.OS);
  RNCommonUtil.exitApp();
};

const showForceUpgrade = (btnGoForceUpdate) => {
  let icon = <SystemUpdateIcon width={sw(60)} height={sw(69)} />;
  AlertHelper.showAlert(
    icon,
    i18n.t('ALERT.APP_TITLE'),
    i18n.t('ERROR.FORCE_UPDATE_REQUIRED_MSG'),
    i18n.t('BUTTONS.UPDATE'),
    i18n.t('BUTTONS.QUIT'),
    btnGoForceUpdate,
    exitApp,
  );
};

const showSoftUpdate = (btnGoSoftUpdate, btnGoNextPage) => {
  let icon = <SystemUpdateIcon width={sw(60)} height={sw(69)} />;

  AlertHelper.showAlert(
    icon,
    i18n.t('ALERT.APP_TITLE'),
    i18n.t('ERROR.SOFT_UPDATE_AVAILABLE_MSG'),
    i18n.t('BUTTONS.UPDATE'),
    i18n.t('BUTTONS.LATER'),
    btnGoSoftUpdate,
    btnGoNextPage,
    null,
    true,
  );
};

const getRedirectUrl = (locale, endPoint) => {
  let langpack =
    locale === LANG_EN ? 'eng' : locale === LANG_TC ? 'tch' : 'sch';
  let url = 'https://www.abc.com.hk/' + langpack + endPoint;
  return url;
};

const getIsDisplayDR = (currentBal) => {
  return currentBal <= 0 ? false : true;
};

const isNumberEmpty = (number) => {
  if (number === 0 || number === '0') return false;
  if (number) return false;
  return true;
};

const getUserId = () => {
  console.log(
    `getUserId -> store.getState().user.userProfile: ${JSON.stringify(
      store.getState().user.userProfile.usrId,
    )}`,
  );
  return store.getState().user.userProfile.usrId;
};

const getUserEmail = () => {
  console.log(
    `getUserEmail -> store.getState().user.userProfile: ${JSON.stringify(
      store.getState().user.userProfile.email,
    )}`,
  );
  return store.getState().user.userProfile.email;
};

let debounce = false;
const preventMultiTap = (onPress) => {
  if (debounce) {
    return;
  }
  debounce = true;
  onPress();
  debounce = setTimeout(() => {
    debounce = false;
  }, 500);
};

const goToAppStore = async (appStoreUrl, googlePlayUrl) => {
  let redirectUrl = googlePlayUrl
    ? googlePlayUrl
    : 'https://play.google.com/store/apps/';
  if (Platform.OS === 'ios') {
    redirectUrl = appStoreUrl
      ? appStoreUrl
      : 'https://www.apple.com/app-store/';
  }

  try {
    await Linking.openURL(redirectUrl);
  } catch (error) {
    console.log('openURL error:', error);
  }
};

export default {
  showForceUpgrade,
  showSoftUpdate,
  getImgScaleHightSize,
  parseURLParams,
  callNumber,
  contactEmail,
  maskEmail,
  maskPhoneNumber,
  getMomentDate,
  getMomentToday,
  getMomentYesterday,
  getMomentTomorrow,
  getMomentDaysAfter,
  getMomentDaysWithin,
  getMomentDateRange,
  getColorBrightness,
  isArrayEmpty,
  exitApp,
  getRedirectUrl,
  numberToCurrencyFormatter,
  getIsDisplayDR,
  isNumberEmpty,
  compareDay,
  showCommonDateFormat,
  showMMYYYDateFormat,
  showDateWithTimeFormat,
  getDisplayCurrency,
  getUserId,
  showTimeFormat,
  getUserEmail,
  preventMultiTap,
  openURL,
  goToAppStore,
};
