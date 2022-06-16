package com.library.promon;

import android.text.TextUtils;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
public class PromonModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private static final String RESULT_OK = "RESULT_OK";
    private static final String RESULT_FAIL = "RESULT_FAIL";

    public PromonModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Promon";
    }

    @ReactMethod
    public void init(Promise promise){
        PromonUtil.addObserver(this.getCurrentActivity());
        promise.resolve(RESULT_OK);
    }

    @ReactMethod
    public void getSAROMItemStr(String key, Promise promise) {
        if (!TextUtils.isEmpty(key)){
            String saromStr = PromonCrypto.getSAROMItemStr(this.getCurrentActivity(), key);
            promise.resolve(saromStr);
        }
        else {
            promise.reject(RESULT_FAIL, RESULT_FAIL);
        }
    }

    @ReactMethod
    public void setSecureString(String key, String value, Promise promise) {
        if (!TextUtils.isEmpty(key)){
            PromonCrypto.setString(value, key);
            promise.resolve(RESULT_OK);
        }
        else {
            promise.reject(RESULT_FAIL, RESULT_FAIL);
        }
    }

    @ReactMethod
    public void getSecureString(String key, Promise promise) {
        if (!TextUtils.isEmpty(key)){
            String retrievedStr = PromonCrypto.getStringForKey(key);
            promise.resolve(retrievedStr);
        }
        else {
            promise.reject(RESULT_FAIL, RESULT_FAIL);
        }
    }

    @ReactMethod
    public void removeSecureString(String key, Promise promise) {
        if (!TextUtils.isEmpty(key)){
            PromonCrypto.removeDataForKey(key);
            promise.resolve(RESULT_OK);
        }
        else {
            promise.reject(RESULT_FAIL, RESULT_FAIL);
        }
    }


}
