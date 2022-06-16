async function encrypt(data, key, iv) {
  //   let encryptedData = '';
  //   try {
  //     encryptedData = await RNAes.AES256CBC({
  //       operation: 'encrypt',
  //       data: data,
  //       key: key,
  //       iv: iv,
  //     });
  //     console.log('RNAes -> encrypt -> encryptedData: ' + encryptedData);
  //     return Promise.resolve(encryptedData);
  //   } catch (e) {
  //     console.log('RNAes -> encrypt -> error: ', e);
  //     return Promise.reject(e);
  //   }
}

async function decrypt(data, key, iv) {
  //   let decryptedData = '';
  //   try {
  //     decryptedData = await RNAes.AES256CBC({
  //       operation: 'decrypt',
  //       data: data,
  //       key: key,
  //       iv: iv,
  //     });
  //     console.log('RNAes -> decrypt -> decryptedData: ' + decryptedData);
  //     return Promise.resolve(decryptedData);
  //   } catch (e) {
  //     console.log('RNAes -> decrypt -> error: ', e);
  //     return Promise.reject(e);
  //   }
}

export default {
  encrypt,
  decrypt,
};
