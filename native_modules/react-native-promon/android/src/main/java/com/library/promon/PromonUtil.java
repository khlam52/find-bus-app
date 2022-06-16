package com.library.promon;

import android.app.Activity;

import no.promon.shield.callbacks.CallbackManager;
import no.promon.shield.callbacks.ExtendedObserver;

public class PromonUtil {
    private static ExtendedObserver observer;
    public static void addObserver(Activity activity){
        observer = new PromonExtendedObserver(activity);
        CallbackManager.setExtendedObserver(activity, observer);
    }
}
