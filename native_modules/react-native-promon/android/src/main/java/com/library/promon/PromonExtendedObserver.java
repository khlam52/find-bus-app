package com.library.promon;

import no.promon.shield.callbacks.*;

import android.app.Activity;
import android.content.DialogInterface;
import android.util.Log;
import android.util.Pair;

public class PromonExtendedObserver implements ExtendedObserver {

    public static boolean alertShown = false;
    private Activity activity;

    /*
    ROOTING,
    REPACKAGING,
    EMULATOR,
    DEBUGGER,
    KEYBOARD,
    SCREENREADER,
    NATIVE_CODE_HOOKS,
    HOOKING_FRAMEWORKS,
    FOREGROUND_OVERRIDE,
    FILESYSTEM_SCANNING,
    FILESYSTEM_WATCHING,
    SCREEN_MIRRORING;
    */

    Pair<String, String> PROMONA01 = new Pair<>("PMN-020", "ROOTING");
    Pair<String, String> PROMONA02 = new Pair<>("PMN-021-02", "REPACKAGING");
    Pair<String, String> PROMONA03 = new Pair<>("PMN-021-03", "EMULATOR");
    Pair<String, String> PROMONA04 = new Pair<>("PMN-021-04", "DEBUGGER");
    Pair<String, String> PROMONA05 = new Pair<>("PMN-021-05", "KEYBOARD");
    Pair<String, String> PROMONA06 = new Pair<>("PMN-021-06", "SCREENREADER");
    Pair<String, String> PROMONA07 = new Pair<>("PMN-021-07", "NATIVE_CODE_HOOKS");
    Pair<String, String> PROMONA08 = new Pair<>("PMN-021-08", "HOOKING_FRAMEWORKS");
    Pair<String, String> PROMONA09 = new Pair<>("PMN-021-09", "FOREGROUND_OVERRIDE");
    Pair<String, String> PROMONA10 = new Pair<>("PMN-021-10", "FILESYSTEM_SCANNING");
    Pair<String, String> PROMONA11 = new Pair<>("PMN-021-11", "FILESYSTEM_WATCHING");
    Pair<String, String> PROMONA12 = new Pair<>("PMN-021-12", "SCREEN_MIRRORING");


    public PromonExtendedObserver(Activity activity) {
        this.activity = activity;
    }

    public void handleCallback(CallbackData callbackdata) {
        CallbackType type = callbackdata.getCallbackType();
        switch (type) {
            case ROOTING: {
                RootingData data = (RootingData) callbackdata;
                if (data.isDeviceCertainlyRooted()){
                    displayAlert(PROMONA01.first);
                }
                break;
            }

            case REPACKAGING: {
                RepackagingData data = (RepackagingData) callbackdata;
                if(data.isRepackaged()){
                    displayAlert(PROMONA02.first);
                }
                break;
            }

            case EMULATOR:{
                EmulatorData data = (EmulatorData) callbackdata;
                if(data.isRunningOnEmulator()){
                    displayAlert(PROMONA03.first);
                }
                break;
            }

            case DEBUGGER:{
                DebuggerData data = (DebuggerData) callbackdata;
                if(data.isRunningUnderDebugger()){
                    displayAlert(PROMONA04.first);
                }
                break;
            }

            case KEYBOARD:{

                KeyboardData data = (KeyboardData) callbackdata;
                if(data.isKeyboardUntrusted()){
                    displayAlert(PROMONA05.first);
                }

                break;
            }

            case SCREENREADER: {
                /*
                ScreenreaderData data = (ScreenreaderData) callbackdata;
                if (data.isUntrustedScreenreaderPresent()) {
                    displayAlert(PROMON06.first);
                }
                */
                break;
            }

            case NATIVE_CODE_HOOKS:{
                NativeCodeHooksData data = (NativeCodeHooksData) callbackdata;
                if(data.areNativeCodeHooksPresent()){
                    displayAlert(PROMONA07.first);
                }
                break;

            }
            case HOOKING_FRAMEWORKS:{
                HookingFrameworksData data = (HookingFrameworksData) callbackdata;
                if (data.areHookingFrameworksPresent()){
                    displayAlert(PROMONA08.first);
                }
                break;
            }

            case FOREGROUND_OVERRIDE:{
                ForegroundOverrideData data = (ForegroundOverrideData) callbackdata;
                Log.d("Promon", "data.getAttackProbability() : " + data.getAttackProbability() + "");
                Log.d("Promon", "data.getOurLastForegroundDuration() : " + data.getOurLastForegroundDuration() + "");
//                if(data.getAttackProbability()>80 || data.getOurLastForegroundDuration()<100){
//                    displayAlert(PROMON09.first);
//                }
                break;
            }

            case FILESYSTEM_SCANNING:{
//                PROMON10
                break;
            }
            case FILESYSTEM_WATCHING:{
//                PROMON11
                break;
            }
            case SCREEN_MIRRORING:{
//                PROMON12
                break;
            }
        }

    }

    public void displayAlert(String errorCode){

        if(!alertShown && activity != null) {
            final String msg = activity.getResources().getString((errorCode.equals(PROMONA01)) ? R.string.rooted_alert:R.string.security_risk, errorCode);
            final String exit = activity.getResources().getString(R.string.common_exit);

            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    android.app.AlertDialog.Builder dialog = new android.app.AlertDialog.Builder(activity);
                    dialog.setMessage(msg);
                    dialog.setCancelable(false);

                    dialog.setPositiveButton(exit, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface arg0, int arg1) {
                            activity.finish();
                            android.os.Process.killProcess(android.os.Process.myPid());
                        }
                    });

                    dialog.show();
                }
            });

            alertShown = true;
        }
    }

}
