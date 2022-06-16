import DataPersister from '~src/utils/DataPersister';

// Static Data
const DB_KEY_SAVED_IS_VIEWED_CRITICAL_NOTICE = '@isViewedCriticalNotice';
const DB_KEY_SAVED_IS_VIEWED_IMPORTANT_NOTICE = '@isViewedImportantNotice';
const DB_KEY_SAVED_IS_VIEWED_TNC = '@isViewedTNC';

const DB_KEY_SAVED_LOCALE = '@locale';
const DB_KEY_SAVED_THEME = '@theme';
const DB_KEY_SAVED_IS_FIRST_LAUNCH = '@isFirstLaunch';

// Soft Update
const DE_KEY_SAVED_NOT_SHOW_SOFT_UPDATE = '@notShowSoftUpdate';

//Biometric Auth
const DB_KEY_SAVED_IS_REGISTERED_BIO_AUTH = '@isRegisteredBioAuth';

// Static Data
function getIsViewedCriticalNotice() {
  return DataPersister.getBoolean(
    DB_KEY_SAVED_IS_VIEWED_CRITICAL_NOTICE,
    false,
  );
}
function setIsViewedCriticalNotice(isViewed) {
  return DataPersister.setBoolean(
    DB_KEY_SAVED_IS_VIEWED_CRITICAL_NOTICE,
    isViewed,
  );
}

function getIsViewedImportantNotices() {
  return DataPersister.getBoolean(
    DB_KEY_SAVED_IS_VIEWED_IMPORTANT_NOTICE,
    false,
  );
}
function setIsViewedImportantNotices(isViewed) {
  return DataPersister.setBoolean(
    DB_KEY_SAVED_IS_VIEWED_IMPORTANT_NOTICE,
    isViewed,
  );
}

function getIsViewedTNC() {
  return DataPersister.getBoolean(DB_KEY_SAVED_IS_VIEWED_TNC, false);
}
function setIsViewedTNC(isViewed) {
  return DataPersister.setBoolean(DB_KEY_SAVED_IS_VIEWED_TNC, isViewed);
}

function getIsFirstLaunch() {
  return DataPersister.getBoolean(DB_KEY_SAVED_IS_FIRST_LAUNCH, true);
}
function setIsFirstLaunch(isFirstLaunch) {
  return DataPersister.setBoolean(DB_KEY_SAVED_IS_FIRST_LAUNCH, isFirstLaunch);
}

function setLocale(locale) {
  return DataPersister.setString(DB_KEY_SAVED_LOCALE, locale);
}

function getLocale() {
  return DataPersister.getString(DB_KEY_SAVED_LOCALE);
}

function setTheme(themeName) {
  return DataPersister.setString(DB_KEY_SAVED_THEME, themeName);
}

function getTheme() {
  return DataPersister.getString(DB_KEY_SAVED_THEME);
}

function getIsNotShowSoftUpdate() {
  return DataPersister.getBoolean(DE_KEY_SAVED_NOT_SHOW_SOFT_UPDATE, false);
}

function setIsNotShowSoftUpdate(isShow) {
  return DataPersister.setBoolean(DE_KEY_SAVED_NOT_SHOW_SOFT_UPDATE, isShow);
}

function getIsRegisteredBioAuth() {
  return DataPersister.getBoolean(DB_KEY_SAVED_IS_REGISTERED_BIO_AUTH, false);
}

function setIsRegisteredBioAuth(isRegistered) {
  return DataPersister.setBoolean(
    DB_KEY_SAVED_IS_REGISTERED_BIO_AUTH,
    isRegistered,
  );
}

export default {
  getIsViewedCriticalNotice,
  setIsViewedCriticalNotice,
  getIsViewedImportantNotices,
  setIsViewedImportantNotices,
  getIsViewedTNC,
  setIsViewedTNC,
  setLocale,
  getLocale,
  setTheme,
  getTheme,
  getIsFirstLaunch,
  setIsFirstLaunch,
  getIsNotShowSoftUpdate,
  setIsNotShowSoftUpdate,
  getIsRegisteredBioAuth,
  setIsRegisteredBioAuth,
};
