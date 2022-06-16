
package com.reactlibrary;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import timber.log.Timber;
import android.R;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;

public class RNCommonUtilModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext reactContext;

  public RNCommonUtilModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "RNCommonUtil";
  }

  @ReactMethod
  public void pushNoti(ReadableMap dataDict) {
    Timber.d("RNCommonUtilModule -> pushNoti");
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      String pushChannel = dataDict.getString("pushChannel");
      NotificationChannel channel = new NotificationChannel("0", pushChannel, NotificationManager.IMPORTANCE_HIGH);
      channel.setDescription(pushChannel);

      NotificationManager notificationManager = reactContext.getSystemService(NotificationManager.class);
      notificationManager.createNotificationChannel(channel);
    }
    
    NotificationCompat.Builder builder = new NotificationCompat.Builder(this.reactContext, "0")
            .setSmallIcon(R.drawable.sym_def_app_icon)
            .setContentTitle(dataDict.getString("title"))
            .setContentText(dataDict.getString("body"))
            .setStyle(new NotificationCompat.BigTextStyle()
                    .bigText(dataDict.getString("body")))
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true);
    NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this.reactContext);
    notificationManager.notify(1, builder.build());
  }

  @ReactMethod
  public void exitApp() {
    android.os.Process.killProcess(android.os.Process.myPid());
  }

}