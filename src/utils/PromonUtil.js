import Promon from 'react-native-promon';

const getAppData = async () => {
  console.log('PromonUtil -> getAppData');
  //   await setSecureString('name', 'ken');
  //   let name = await getSecureString('name');
  //   await removeSecureString('name');

  let kek = await getSAROMItemStr('dev/aesKey');
  let param = {
    kek: kek,
  };
  return param;
};

const getSAROMItemStr = async (filePathInSaromFolder) => {
  return Promon.getSAROMItemStr(filePathInSaromFolder);
};

const setSecureString = async (key, value) => {
  return Promon.setSecureString(key, value);
};

const getSecureString = async (key) => {
  return Promon.getSecureString(key);
};

const removeSecureString = async (key) => {
  return Promon.removeSecureString(key);
};

export default {
  getAppData,
  getSAROMItemStr,
  setSecureString,
  getSecureString,
  removeSecureString,
};
