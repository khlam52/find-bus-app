import { sha256 } from 'js-sha256';

import { currentSessionID } from '~src/contexts/store/Store';
import { AESUtil } from '~src/utils/AESUtil';

async function encrypt(data) {
  let dek = await getDEK();
  let iv = await getIV();

  let encryptedData;
  if (data) {
    encryptedData = await AESUtil.encrypt(data, dek, iv);
  }
  console.log('EncryptionService -> encrypt -> encryptedData: ', encryptedData);

  return encryptedData;
}

async function decrypt(data) {
  let dek = await getDEK();
  let iv = await getIV();

  let decryptedData;
  if (data) {
    decryptedData = await AESUtil.decrypt(data, dek, iv);
  }
  console.log('EncryptionService -> decrypt -> decryptedData: ', decryptedData);

  return decryptedData;
}

async function getDEK() {
  //   let promonAppData = await PromonUtil.getAppData();
  //   console.log('EncryptionService -> getDEK:', promonAppData.decryptedDEK);
  //   return promonAppData.decryptedDEK;
}

async function getIV() {
  let iv = '';

  let sessionID = currentSessionID;
  console.log('EncryptionService -> sessionID:', sessionID);
  if (sessionID !== undefined) {
    sessionID = sessionID.split('-').join('');
    let sessionIDBitsArray = strToUtf8Bytes(sessionID);
    let sessionIDFirst64Bits = sessionIDBitsArray.slice(0, 8);
    let sessionIDLast64Bits = sessionIDBitsArray.slice(
      sessionIDBitsArray.length - 8,
      sessionIDBitsArray.length,
    );
    iv = byteToString(sessionIDFirst64Bits.concat(sessionIDLast64Bits));
    console.log('EncryptionService -> getIV -> iv byteToString: ', iv);

    return iv;
  } else {
    return '';
  }
}

function getCheckSum(data) {
  let sha256Value = sha256(JSON.stringify(data));
  return sha256Value;
}

function strToUtf8Bytes(str) {
  const utf8 = [];
  for (let ii = 0; ii < str.length; ii++) {
    let charCode = str.charCodeAt(ii);
    if (charCode < 0x80) utf8.push(charCode);
    else if (charCode < 0x800) {
      utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
    } else if (charCode < 0xd800 || charCode >= 0xe000) {
      utf8.push(
        0xe0 | (charCode >> 12),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f),
      );
    } else {
      ii++;
      // Surrogate pair:
      // UTF-16 encodes 0x10000-0x10FFFF by subtracting 0x10000 and
      // splitting the 20 bits of 0x0-0xFFFFF into two halves
      charCode =
        0x10000 + (((charCode & 0x3ff) << 10) | (str.charCodeAt(ii) & 0x3ff));
      utf8.push(
        0xf0 | (charCode >> 18),
        0x80 | ((charCode >> 12) & 0x3f),
        0x80 | ((charCode >> 6) & 0x3f),
        0x80 | (charCode & 0x3f),
      );
    }
  }
  return utf8;
}

function byteToString(arr) {
  if (typeof arr === 'string') {
    return arr;
  }
  var str = '',
    _arr = arr;
  for (var i = 0; i < _arr.length; i++) {
    var one = _arr[i].toString(2),
      v = one.match(/^1+?(?=0)/);
    if (v && one.length == 8) {
      var bytesLength = v[0].length;
      var store = _arr[i].toString(2).slice(7 - bytesLength);
      for (var st = 1; st < bytesLength; st++) {
        store += _arr[st + i].toString(2).slice(2);
      }
      str += String.fromCharCode(parseInt(store, 2));
      i += bytesLength - 1;
    } else {
      str += String.fromCharCode(_arr[i]);
    }
  }
  return str;
}

export default { encrypt, decrypt };
