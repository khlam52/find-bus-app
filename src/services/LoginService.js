async function bioLogin(successCallback, failureCallback) {
  //   try {
  //     let initResponse = await ApiService.mallUserLoginInit();
  //     if (initResponse.challenge) {
  //       let mallUserEntityId = await StorageService.getBioAuthUserId();
  //       let bioToken = await StorageService.getBioAuthToken();
  //       bioToken = await EncryptionService.encrypt(bioToken, 'MALL');
  //       await ApiService.mallUserLoginByBIO(
  //         mallUserEntityId,
  //         bioToken,
  //         initResponse.challenge,
  //       )
  //         .then((response) => {
  //           console.log('LoginService -> bioLogin -> result: ', response);
  //           successCallback(response);
  //         })
  //         .catch((error) => {
  //           console.log('LoginService -> bioLogin -> error: ', error);
  //           failureCallback(error);
  //         });
  //     } else {
  //       failureCallback();
  //     }
  //   } catch (error) {
  //     console.log(
  //       'LoginService -> bioLogin -> mallUserLoginInit -> error: ',
  //       error,
  //     );
  //     failureCallback(error);
  //   }
}

export default { bioLogin };
