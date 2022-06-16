#import "Promon.h"
#import "PromonCrypto.h"
#import "PromonUtil.h"

static NSString *const RESULT_OK = @"RESULT_OK";
static NSString *const RESULT_FAIL = @"RESULT_FAIL";

@implementation Promon

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(init:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [[PromonUtil getInstance]addObserver];
    resolve(RESULT_OK);
}

RCT_EXPORT_METHOD(getSAROMItemStr:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if (key) {
        NSString* saromStr = [PromonCrypto getSAROMItemStr:key];
        resolve(saromStr);
    }
    else{
        reject(RESULT_FAIL, RESULT_FAIL, nil);
    }
}

RCT_EXPORT_METHOD(setSecureString:(NSString *)key value:(NSString*)value resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if (value && key) {
        [PromonCrypto setString:value forKey:key];
        resolve(RESULT_OK);
    }
    else{
        reject(RESULT_FAIL, RESULT_FAIL, nil);
    }
}

RCT_EXPORT_METHOD(getSecureString:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if (key) {
        NSString *retrievedStr = [PromonCrypto getStringForKey:key];
        resolve(retrievedStr);
    }
    else{
        reject(RESULT_FAIL, RESULT_FAIL, nil);
    }
}

RCT_EXPORT_METHOD(removeSecureString:(NSString *)key resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    if (key) {
        [PromonCrypto removeDataForKey:key];
        resolve(RESULT_OK);
    }
    else{
        reject(RESULT_FAIL, RESULT_FAIL, nil);
    }

}


@end
