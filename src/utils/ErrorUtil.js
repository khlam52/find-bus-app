import i18n from 'i18n-js';
import _ from 'lodash';

import AlertHelper from './AlertHelper';
import CommonUtil from './CommonUtil';
import { ENV } from '~src/config/Config';
import { SERVER_TO_APP_LANG_MAP } from '~src/constants/Constant';
import { setLogout } from '~src/contexts/store/Store';
import RootNavigation from '~src/navigations/RootNavigation';

const Buffer = require('buffer').Buffer;

const SERVER_ERR_CODE_MSG_MAP = [
  {
    errCode: ['CHN-00201'],
    icon: AlertHelper.getSystemMaintenanceIcon(),
    errMsg: 'ERROR.APP_SERVICE_SUSPENDED_MSG',
    errTitle: 'ALERT.APP_TITLE',
    btnText: 'BUTTONS.QUIT',
    callback: () => {
      CommonUtil.exitApp();
    },
  },
  {
    errCode: ['MAIN-02001', 'MAIN-72001', 'MAIN-02614'],
    icon: AlertHelper.getWarningIcon(),
    errMsg: 'ERROR.UNEXPECTED_ERROR_FROM_SERVER_MSG',
    errTitle: 'ALERT.ERROR',
    btnText: 'BUTTONS.OK',
    callback: () => {},
  },
  {
    errCode: ['ERR-02-401-04', 'CHN-00103'],
    icon: AlertHelper.getWarningIcon(),
    errMsg: 'ERROR.LOGGED_IN_THE_SAME_ACCOUNT_MSG',
    errTitle: 'ALERT.APP_TITLE',
    btnText: 'BUTTONS.OK',
    callback: () => {},
  },
  {
    errCode: ['ERR-02-401-02', 'CHN-00101'],
    icon: AlertHelper.getWarningIcon(),
    errMsg: 'ERROR.IDLED_FOR_15_MINUTES_MSG',
    errTitle: 'ALERT.APP_TITLE',
    btnText: 'BUTTONS.QUIT',
    callback: () => {},
  },
  {
    errCode: ['ERR-02-401-05'],
    icon: AlertHelper.getWarningIcon(),
    errMsg: 'ERROR.IDLED_FOR_15_MINUTES_MSG',
    errTitle: 'ALERT.APP_TITLE',
    btnText: 'BUTTONS.QUIT',
    callback: () => {},
  },
  //OTP
  {
    errCode: ['AUTH-29056'],
    icon: AlertHelper.getCommonAlertIcon(),
    errMsg: 'ERROR.INLINE_ENTERS_INVALID_OTP_MSG',
    errTitle: '',
    btnText: '',
    callback: () => {},
    isInline: true,
  },
  {
    errCode: ['AUTH-29057'],
    icon: AlertHelper.getCommonAlertIcon(),
    errMsg: 'ERROR.INLINE_ENTERS_EXPIRED_OTP_MSG',
    errTitle: '',
    btnText: '',
    callback: () => {},
    isInline: true,
  },
  {
    errCode: ['AUTH-01499'],
    icon: AlertHelper.getCommonAlertIcon(),
    errMsg: 'ERROR.OTP_NOT_GENERATED_MSG',
    errTitle: 'ALERT.APP_TITLE',
    btnText: 'BUTTONS.OK',
    callback: () => {},
  },
  {
    errCode: ['CHN-00301'],
    icon: AlertHelper.getCommonAlertIcon(),
    errMsg: 'ERROR.ADMIN_OR_AUTHORIZER_WITHOUT_REGISTERED_MOBILE_NUM_MSG',
    errTitle: 'ALERT.APP_TITLE',
    btnText: 'BUTTONS.OK',
    callback: () => {
      RootNavigation.back();
    },
  },
  // Change Password
  {
    errCode: ['AUTH-02002'],
    icon: AlertHelper.getCommonAlertIcon(),
    errMsg: 'ERROR.NOT_ALLOWED_TO_USE_MOBILE_CHANNEL_MSG',
    errTitle: 'ALERT.APP_TITLE',
    btnText: 'BUTTONS.OK',
    callback: () => {},
  },
  {
    errCode: ['CHN-00601'],
    icon: AlertHelper.getCommonAlertIcon(),
    errMsg: 'ERROR.INCORRECT_ID_PASSWORD_MSG',
    errTitle: 'ALERT.APP_TITLE',
    btnText: 'BUTTONS.OK',
    callback: () => {},
  },
  {
    errCode: ['ACCT-00101'],
    icon: AlertHelper.getCommonAlertIcon(),
    errMsg: 'ERROR.EXCHANGE_RATE_ERR_MSG',
    errTitle: 'ALERT.APP_TITLE',
    btnText: 'BUTTONS.OK',
    callback: () => {},
  },
];

const showApiErrorMsgAlert = (response = null, callbackFunc = () => {}) => {
  console.log('ErrorUtil -> showApiErrorMsgAlert');

  let errObj = getNonLoginApiDisplayError(response);
  console.log('ErrorUtil -> showApiErrorMsgAlert -> errObj', errObj);

  let title = _.get(errObj, 'title', '');
  let errMsg = _.get(errObj, 'msg', i18n.t('ERROR.ERROR_GENERAL'));
  let btnText = _.get(errObj, 'btnText', i18n.t('BUTTONS.OK'));
  let icon = _.get(errObj, 'icon', AlertHelper.getWarningIcon());
  let callback = _.get(errObj, 'callback', null)
    ? errObj.callback
    : callbackFunc;

  AlertHelper.showAlertWithOneButton(icon, title, errMsg, btnText, callback);
};

const specialHandleCase = (errCode) => {
  switch (errCode) {
    case 'ERR-02-401-04':
    case 'CHN-00103':
    case 'CHN-00101':
      setLogout({ is401HandleCase: true });
      break;
    case 'ERR-02-401-05':
    case 'ERR-02-401-02':
      setLogout({ is401HandleCase: true });
      break;
  }
};

const showApiLoginErrorMsgAlert = (
  response = null,
  callbackFunc = () => {},
) => {
  console.log('ErrorUtil -> showApiLoginErrorMsgAlert -> response: ', response);

  let displayErrCode = _.has(response, 'bodyString.result.code')
    ? '\n[' + _.get(response, 'bodyString.result.code') + ']'
    : '';
  let errorCode = (errorCode = _.get(response, 'bodyString.result.code', ' '));
  let errorMsgObj = getNonLoginApiDisplayError(response);

  let locale = SERVER_TO_APP_LANG_MAP[i18n.locale];
  let errMsg = errorMsgObj.msg;
  let icon = AlertHelper.getWarningIcon();
  specialHandleCase(errorCode);

  if (
    _.has(response, 'bodyString.result.code') &&
    _.has(response, 'bodyString.result.message')
  ) {
    // B/E return Result Obj error
    console.log('ErrorUtil -> showApiLoginErrorMsgAlert -> base64decode ');
    try {
      response.displayMessage = JSON.parse(
        Buffer.from(response.bodyString.result.message, 'base64').toString(),
      );
      errMsg = response.displayMessage[locale] + displayErrCode;
      console.log(
        'ErrorUtil -> showApiLoginErrorMsgAlert -> base64decode -> errMsg: ' +
          errMsg,
      );
    } catch (error) {
      console.log(
        'ErrorUtil -> showApiLoginErrorMsgAlert -> base64decode -> error: ',
        error,
      );
    }
    AlertHelper.showAlertWithOneButton(
      AlertHelper.getWarningIcon(),
      i18n.t('ALERT.APP_TITLE'),
      errMsg,
      i18n.t('BUTTONS.OK'),
      callbackFunc,
    );
  } else {
    showApiErrorMsgAlert(response, callbackFunc);
  }
};

const getNonLoginApiDisplayError = (error) => {
  let errorObj = {
    icon: AlertHelper.getCommonAlertIcon,
    title: i18n.t('ALERT.APP_TITLE'),
    msg: i18n.t('ERROR.GENERIC_OR_UNEXPECTED_ERROR_MSG'),
    btnText: i18n.t('BUTTONS.OK'),
    callback: null,
    isInline: false,
    errorCode: '',
  };

  console.log(
    'ErrorUtil -> getNonLoginApiDisplayError -> default errorObj: ',
    errorObj,
  );
  let serverLocal = SERVER_TO_APP_LANG_MAP[i18n.locale];
  let errorCodeDisplay = '';
  if (_.get(error, 'bodyString.result.code', null)) {
    errorObj.errorCode = _.get(error, 'bodyString.result.code', ' ');
    errorCodeDisplay = '[' + errorObj.errorCode + ']';
    errorObj.msg += errorCodeDisplay;
  }
  if (_.get(error, 'bodyString.code', null)) {
    errorObj.errorCode = _.get(error, 'bodyString.code', ' ');
    errorCodeDisplay = '[' + errorObj.errorCode + ']';
    errorObj.msg += errorCodeDisplay;
  }

  errorObj.errMsg += '[' + errorObj.errorCode + ']';
  errorObj.icon = AlertHelper.getWarningIcon();

  specialHandleCase(errorObj.errorCode);

  let statusError = _.get(error, 'status', null);
  if (
    statusError == -1 ||
    statusError == -2 ||
    statusError == -3 ||
    statusError == -4 ||
    statusError == -5 ||
    statusError == -6
  ) {
    console.log('Network Error');
    //Network Error
    errorObj.title = i18n.t('ALERT.APP_TITLE');
    errorObj.msg = i18n.t('ERROR.NOT_CONNECTED_TO_INTERNET_MSG');
  }
  if (_.get(error, 'bodyString.displayMessage.' + serverLocal, null)) {
    errorObj.msg =
      _.get(error, 'bodyString.displayMessage.' + serverLocal, errorObj.msg) +
      '[' +
      errorObj.errorCode +
      ']';
    console.log(`found SERVER_TO_APP_LANG_MAP: ${JSON.stringify(errorObj)}`);
  } else if (errorObj.errorCode) {
    const errorMap = getFrontendErrorMap(errorObj.errorCode);
    console.log(
      'ErrorUtil -> getNonLoginApiDisplayError -> found SERVER_TO_APP_LANG_MAP: ',
      errorObj,
    );
    if (errorMap) {
      errorObj.icon = errorMap.icon;
      errorObj.title = i18n.t(errorMap.errTitle);
      errorObj.msg = i18n.t(errorMap.errMsg) + errorCodeDisplay;
      errorObj.btnText = i18n.t(errorMap.btnText);
      errorObj.callback = errorMap.callback;
      errorObj.isInline = _.get(errorMap, 'isInline', false);
    }
  }

  if (ENV === 'sit' && _.get(error, 'requestId', null)) {
    errorObj.msg =
      errorObj.msg + '[X-RequestId: ' + _.get(error, 'requestId', '') + ']';
  }

  return errorObj;
};

const getFrontendErrorMap = (errorCode) => {
  let errorItem = null;
  SERVER_ERR_CODE_MSG_MAP.forEach((errItem) => {
    if (errItem.errCode.includes(errorCode)) {
      console.log(
        'ErrorUtil -> getFrontendErrorMap -> findErrMsg -> errItem Matched: ',
        errItem,
      );
      errorItem = errItem;
    }
  });
  return errorItem;
};

const showInternalNotConnectError = (callback = () => {}) => {
  let errTitle = i18n.t('ALERT.APP_TITLE');
  let errMsg = i18n.t('ERROR.NOT_CONNECTED_TO_INTERNET_MSG');
  let btnText = i18n.t('BUTTONS.OK');

  AlertHelper.showAlertWithOneButton(
    AlertHelper.getWarningIcon(),
    errTitle,
    errMsg,
    btnText,
    callback,
  );
};

export default {
  showInternalNotConnectError,
  showApiErrorMsgAlert,
  showApiLoginErrorMsgAlert,
  getNonLoginApiDisplayError,
};
