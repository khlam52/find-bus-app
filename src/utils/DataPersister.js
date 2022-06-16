import AsyncStorage from '@react-native-async-storage/async-storage';

import * as AppError from '~src/constants/AppError';

async function getString(key, defaultValue = null) {
  try {
    let value = await AsyncStorage.getItem(key);
    if (value) {
      return value;
    }
    return defaultValue;
  } catch (error) {
    console.error('DataPersister -> getItem -> error:', error);
    throw AppError.getErrorResult(AppError.APP_DATA_PERSISTER_ERROR);
  }
}

async function setString(key, value) {
  try {
    await AsyncStorage.setItem(key, value);
    return AppError.getSuccessResult();
  } catch (error) {
    console.error('DataPersister -> setItem -> error:', error);
    throw AppError.getErrorResult(AppError.APP_DATA_PERSISTER_ERROR);
  }
}

async function getJson(key, defaultValue = null) {
  try {
    let result = await getString(key);
    if (result) {
      return JSON.parse(result);
    }
    return defaultValue;
  } catch (error) {
    console.error('DataPersister -> setJson -> error:', error);
    throw AppError.getErrorResult(AppError.APP_DATA_PERSISTER_ERROR);
  }
}

async function setJson(key, jsonObject) {
  try {
    let result = await setString(key, JSON.stringify(jsonObject));
    if (result && result.result.code === AppError.SUCCESS) {
      return result;
    }
  } catch (error) {
    console.error('DataPersister -> setJson -> error:', error);
    throw AppError.getErrorResult(AppError.APP_DATA_PERSISTER_ERROR);
  }
}

async function setBoolean(key, value) {
  try {
    let boolStr = value === true ? 'true' : 'false';
    await AsyncStorage.setItem(key, boolStr);
    return AppError.getSuccessResult();
  } catch (error) {
    console.error('DataPersister -> setBoolean -> error:', error);
    throw AppError.getErrorResult(AppError.APP_DATA_PERSISTER_ERROR);
  }
}

async function getBoolean(key, defaultValue = false) {
  try {
    let state = await AsyncStorage.getItem(key);
    if (state) {
      return state === 'true';
    }
    return defaultValue;
  } catch (error) {
    console.error('DataPersister -> getBoolean -> error:', error);
    throw AppError.getErrorResult(AppError.APP_DATA_PERSISTER_ERROR);
  }
}

export default {
  getString,
  setString,
  getJson,
  setJson,
  getBoolean,
  setBoolean,
};
