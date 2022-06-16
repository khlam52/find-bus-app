import StorageService from '~src/services/StorageService';
import AlertHelper from '~src/utils/AlertHelper';
import BioAuthUtil from '~src/utils/BioAuthUtil';

const regBioAuth = async () => {
  try {
    await BioAuthUtil.checkDeviceBiometricMode();
  } catch (e) {
    console.log(
      'BioAuthService -> regBioAuth -> checkDeviceBiometricMode -> failCallback: ',
      e,
    );
    if (e.message === 'NOT_ENROLLED') {
      AlertHelper.showErrorAlert('ERROR.ERROR_BIO_AUTH_NOT_ENROLLED');
      return;
    } else if (e.message === 'NO_BIO_AUTH_METHOD') {
      AlertHelper.showErrorAlert('ERROR.ERROR_BIO_AUTH_NOT_SUPPORT');
      return;
    } else if (e.message === 'LOCKOUT') {
      AlertHelper.showErrorAlert('ERROR.ERROR_BIO_AUTH_LOCKOUT');
      return;
    } else if (e.message === 'FACE_ID_PERMISSION') {
      AlertHelper.showErrorAlert('ERROR.ERROR_BIO_AUTH_FACE_ID_PERMISSION');
      return;
    } else {
      AlertHelper.showErrorAlert(
        'ERROR.ERROR_GENERAL',
        e.code ? e.code : 'BIO_R_C',
      );
      return;
    }
  }

  try {
    let result = await BioAuthUtil.biometricAuth('REG');
    console.log(
      'BioAuthService -> regBioAuth -> biometricAuth -> result: ',
      result,
    );
    if (result === 'SUCCESS') {
      // bioAuthSuccessHandle();
    } else {
      if (result.status === 'REJECT') {
        AlertHelper.showErrorAlert(null, 'FER_200_005');
      } else if (result.status !== 'CANCEL') {
        AlertHelper.showErrorAlert('ERROR.ERROR_GENERAL');
      } else if (result.status === 'TRY_AGAIN') {
        AlertHelper.showErrorAlert(null, 'FER_200_005');
      }
    }
  } catch (e) {
    console.log(
      'BioAuthService -> regBioAuth -> biometricAuth -> failCallback: ',
      e,
    );

    AlertHelper.showErrorAlert(
      'ERROR.ERROR_GENERAL',
      e.code ? e.code : 'BIO_R_A',
    );
  }
};

const bioAuthLogin = async () => {
  //   resetScreen();
  //   showLoading();
  try {
    // await LoginService.renewSession();
  } catch (error) {
    console.log(
      'BioAuthService -> bioAuthLogin -> renewSession -> failCallback: ',
      error,
    );
    // hideLoading();
    return;
  }

  try {
    await BioAuthUtil.checkDeviceBiometricMode();
  } catch (e) {
    console.log(
      'BioAuthService -> bioAuthLogin -> checkDeviceBiometricMode -> failCallback: ',
      e,
    );
    if (e.message === 'NOT_ENROLLED') {
      AlertHelper.showErrorAlert(
        'ERROR.ERROR_BIO_AUTH_NOT_ENROLLED',
        null,
        null,
        null,
        async () => {
          await disableBioAuth();
          //   setIsBiometricEnabled(false);
        },
        'A01',
      );
      return;
    } else if (e.message === 'NO_BIO_AUTH_METHOD') {
      AlertHelper.showErrorAlert(
        'ERROR.ERROR_BIO_AUTH_NOT_SUPPORT',
        null,
        null,
        null,
        async () => {
          await disableBioAuth();
          //   setIsBiometricEnabled(false);
        },
        'A01',
      );
      return;
    } else if (e.message === 'LOCKOUT') {
      AlertHelper.showErrorAlert('ERROR.ERROR_BIO_AUTH_LOCKOUT');
      return;
    } else if (e.message === 'FACE_ID_PERMISSION') {
      AlertHelper.showErrorAlert('ERROR.ERROR_BIO_AUTH_FACE_ID_PERMISSION');
      return;
    }
    AlertHelper.showErrorAlert(
      'ERROR.ERROR_GENERAL',
      e.code ? e.code : 'BIO_R_C',
    );
    return;
  }

  try {
    let result = await BioAuthUtil.biometricAuth('LOGIN');
    if (result === 'SUCCESS') {
      return Promise.resolve(result);
    } else if (result.status === 'REJECT') {
      AlertHelper.showErrorAlert(
        'ERROR.ERROR_BIO_AUTH_FAIL',
        null,
        null,
        null,
        async () => {
          await disableBioAuth();
          // setIsBiometricEnabled(false);
        },
        'A01',
      );
    } else if (result.status === 'CHANGED') {
      AlertHelper.showErrorAlert(
        'ERROR.ERROR_BIO_AUTH_CHANGED',
        null,
        null,
        null,
        async () => {
          await disableBioAuth();
          // setIsBiometricEnabled(false);
        },
        'A01',
      );
      return;
    } else if (result.status !== 'CANCEL') {
      AlertHelper.showErrorAlert('ERROR.ERROR_GENERAL');
    }
  } catch (e) {
    console.log(
      'BioAuthService -> bioAuthLogin -> biometricAuth -> failCallback: ',
      e,
    );

    AlertHelper.showErrorAlert(
      'ERROR.ERROR_GENERAL',
      e.code ? e.code : 'BIO_R_A',
    );
  }
};

const disableBioAuth = async () => {
  await StorageService.setIsRegisterMallBioAuth(false);
};

export default {
  regBioAuth,
  bioAuthLogin,
  disableBioAuth,
};
