import React from 'react';

import i18n from 'i18n-js';
import _ from 'lodash';

import { WarningIcon } from '~src/assets/images';
import RootNavigation from '~src/navigations/RootNavigation';
import Route from '~src/navigations/Route';
import { sw } from '~src/styles/Mixins';

// alert function expose every params
const showAlert = (
  icon,
  titleText,
  contentText,
  firstButtonText,
  secondButtonText,
  firstButtonHandler,
  secondButtonHandler,
  contentTextToLeft = false,
  isShowCheckBox = false,
) => {
  let params = {
    icon,
    titleText,
    contentText,
    firstButtonText,
    secondButtonText,
    firstButtonHandler,
    secondButtonHandler,
    contentTextToLeft,
    isShowCheckBox,
  };
  RootNavigation.push(Route.ALERT_SCREEN, params);
};

// show alert with one button
const showAlertWithOneButton = (
  icon,
  titleText,
  contentText,
  buttonText,
  buttonHandler,
  contentTextToLeft,
) => {
  showAlert(
    icon,
    titleText,
    contentText,
    buttonText,
    null,
    buttonHandler,
    null,
    contentTextToLeft,
  );
};

// show error alert with only content and button handler
const showErrorAlert = (contentText, buttonHandler) => {
  showAlertWithOneButton(
    <WarningIcon width={sw(60)} height={sw(69)} />,
    i18n.t('ALERT.ERROR'),
    contentText,
    i18n.t('BUTTONS.OK'),
    buttonHandler,
  );
};

const showErrorAlertByErrorObj = (errorObj) => {
  let alertIcon = <WarningIcon width={sw(60)} height={sw(69)} />;

  let icon = _.has(errorObj, 'icon', null)
    ? _.get(errorObj, 'icon', null)
    : alertIcon;
  showAlertWithOneButton(
    icon,
    errorObj.title,
    errorObj.msg,
    errorObj.btnText,
    errorObj.callback,
  );
};

const getCommonAlertIcon = () => {
  return <WarningIcon width={sw(60)} height={sw(69)} />;
};
const getSystemMaintenanceIcon = () => {
  return <WarningIcon width={sw(60)} height={sw(69)} />;
};

const getWarningIcon = () => {
  return <WarningIcon width={sw(60)} height={sw(69)} />;
};

export default {
  showAlert,
  showAlertWithOneButton,
  showErrorAlert,
  showErrorAlertByErrorObj,
  getCommonAlertIcon,
  getSystemMaintenanceIcon,
  getWarningIcon,
};
