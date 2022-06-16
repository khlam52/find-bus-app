package com.library.promon;

import android.app.Activity;
import android.text.TextUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

import no.promon.shield.storage.local.SecureLocalStorage;
import no.promon.shield.storage.rom.SecureAppRom;
import timber.log.Timber;

public class PromonCrypto {
    private static final String CHARSET_UTF8 = "UTF-8";

    private static String convertISToString(InputStream inputStream){
        if (inputStream != null){
            // Read the stream
            StringBuilder text = new StringBuilder();
            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
            String line;
            try {
                while ((line = reader.readLine()) != null) {
                    text.append(line);
                }
            }
            catch (IOException e) {
                e.printStackTrace();
                return "";
            }

            String saromItemString = text.toString();
            return saromItemString;
        }
        return "";
    }

    //region SAROM
    public static InputStream getSAROMItemData(Activity activity, String pathFromSaromFolder){
        InputStream saromItemData = SecureAppRom.getInstance(activity.getApplicationContext()).open(pathFromSaromFolder);
        if (saromItemData != null){
            return saromItemData;
        }
        return null;
    }

    public static String getSAROMItemStr(Activity activity, String pathFromSaromFolder){
        InputStream saromItemData = PromonCrypto.getSAROMItemData(activity, pathFromSaromFolder);
        return PromonCrypto.convertISToString(saromItemData);
    }
    //endregion

    //region Secure local storage
    public static void setString(String value, String key){
        if (!TextUtils.isEmpty(value) && !TextUtils.isEmpty(key)){
            try {
                byte[] data = value.getBytes(CHARSET_UTF8);
                PromonCrypto.setData(data, key);
            } catch (UnsupportedEncodingException e) {
                Timber.d("PromonCrypto -> setString -> UnsupportedEncodingException:" + e.toString() );
            } catch (IOException e) {
                Timber.d("PromonCrypto -> setString -> IOException:" + e.toString() );
            }
        }
    }

    public static void setData(byte[] data, String key){
        try {
            SecureLocalStorage storage = SecureLocalStorage.getInstance();
            if (storage != null){
                storage.put(key, data);
            }
            else{
                Timber.d("PromonCrypto -> setData -> SecureLocalStorage is null");
            }
        }
        catch (Exception e){
            Timber.d("PromonCrypto -> setData Exception: " + e.toString());
        }
    }

    public static String getStringForKey(String key){
        byte[] dataRetrieved = PromonCrypto.getDataForKey(key);
        if (dataRetrieved != null){
            try {
                String convertedStr = new String(dataRetrieved, CHARSET_UTF8);
                return convertedStr;
            } catch (UnsupportedEncodingException e) {
                Timber.d("PromonCrypto -> getStringForKey -> UnsupportedEncodingException:" + e.toString() );
                return "";
            } catch (IOException e) {
                Timber.d("PromonCrypto -> getStringForKey -> IOException:" + e.toString() );
                return "";
            }
        }
        return "";
    }

    public static byte[] getDataForKey(String key){
        try {
            SecureLocalStorage storage = SecureLocalStorage.getInstance();
            if (storage != null){
                byte[] dataRetrieved = storage.get(key);
                return dataRetrieved;
            }
            else{
                Timber.d("PromonCrypto -> getDataForKey -> SecureLocalStorage is null");
                return null;
            }
        }
        catch (Exception e){
            Timber.d("PromonCrypto -> getDataForKey Exception: " + e.toString());
            return null;
        }
    }

    public static void removeDataForKey(String key){
        try {
            SecureLocalStorage storage = SecureLocalStorage.getInstance();
            if (storage != null){
                storage.remove(key);
            }
            else{
                Timber.d("PromonCrypto -> removeDataForKey -> removeDataForKey is null");
            }
        }
        catch (Exception e){
            Timber.d("PromonCrypto -> removeDataForKey Exception: " + e.toString());
        }
    }


    //endregion

}
