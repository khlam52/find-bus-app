export const SUCCESS = 'SUCCESS';
export const APP_FORCE_UPGRADE = 'APP_FORCE_UPGRADE';
export const APP_SOFT_UPGRADE = 'APP_SOFT_UPGRADE';
export const APP_API_ERROR = 'APP_API_ERROR';
export const APP_DATA_PERSISTER_ERROR = 'APP_DATA_PERSISTER_ERROR';

export function getErrorResult(error) {
  let errorResult = {
    result: {
      code: error,
    },
  };
  return errorResult;
}

export function getSuccessResult(error) {
  let errorResult = {
    result: {
      code: SUCCESS,
    },
  };
  return errorResult;
}
