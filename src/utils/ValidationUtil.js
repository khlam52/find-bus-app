const emailFormatValidation = (email) => {
  var emailRegEx = /^[0-9a-zA-Z][\w.\-']*@[\w-]+([.]([\w-])+)+$/;
  return emailRegEx.test(email);
};

const phoneNumberFormatValidation = (areaCode, phoneNum) => {
  var mobileRegEx;
  switch (areaCode) {
    case 852: {
      mobileRegEx = /^[5679][0-9]{7}$/;
      break;
    }
    case 86: {
      mobileRegEx = /^[0-9]{11}$/;
      break;
    }
    default:
      mobileRegEx = /^[0-9]$/;
  }
  return mobileRegEx.test(phoneNum);
};

const validURL = (str) => {
  var pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return !!pattern.test(str);
};

const isValidLoginUsername = (username) => {
  const regex = /^[a-zA-Z0-9‘’'(),.:;?{}@_/-\s]{1,16}$/g;
  return regex.test(username);
};

const isValidLoginPassword = (password) => {
  return password.length > 0 && password.length <= 16;
};

const isValidChangePassword = (password) => {
  const regex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/g;
  return regex.test(password);
};
const isValidInputRemark = (remark) => {
  const regex = /^[a-zA-Z0-9(),+./;?{ }@_\s]{0,35}$/g;
  return regex.test(remark);
};

export default {
  emailFormatValidation,
  phoneNumberFormatValidation,
  validURL,
  isValidLoginUsername,
  isValidLoginPassword,
  isValidChangePassword,
  isValidInputRemark,
};
