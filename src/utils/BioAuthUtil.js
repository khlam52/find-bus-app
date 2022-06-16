import RNBiometricAuth from 'react-native-biometric-auth';

async function checkDeviceBiometricMode() {
  let deviceBiometricMode = '';
  try {
    deviceBiometricMode = await RNBiometricAuth.getDeviceBiometricMode();
    console.log(
      'BioAuthUtil -> checkDeviceBiometricMode -> deviceBiometricMode: ' +
        deviceBiometricMode,
    );
    return Promise.resolve(deviceBiometricMode);
  } catch (e) {
    console.log('BioAuthUtil -> checkDeviceBiometricMode -> error: ', e);
    return Promise.reject(e);
  }
}

async function biometricAuth(fromFlow) {
  try {
    let result = await RNBiometricAuth.biometricAuth({ fromFlow: fromFlow });
    console.log('BioAuthUtil -> biometricAuth -> biometricAuth: ' + result);
    return Promise.resolve(result);
  } catch (e) {
    console.log('BioAuthUtil -> biometricAuth -> error: ', e);
    return Promise.reject(e);
  }
}

async function cancelAuth() {
  try {
    let result = await RNBiometricAuth.cancelAuthentication();
    console.log('BioAuthUtil -> cancelAuth -> cancelAuthentication: ' + result);
    return Promise.resolve(result);
  } catch (e) {
    console.log('BioAuthUtil -> cancelAuth -> error: ', e);
    return Promise.reject(e);
  }
}

export default { checkDeviceBiometricMode, biometricAuth, cancelAuth };
