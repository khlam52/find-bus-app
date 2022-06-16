package com.rnproject;

import com.facebook.react.ReactActivity;
import com.library.promon.PromonUtil;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.WindowManager;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "RNProject";
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);

    if (!TextUtils.isEmpty(BuildConfig.IS_ENABLE_PROMON)){
      if ("true".equalsIgnoreCase(BuildConfig.IS_ENABLE_PROMON)){
        PromonUtil.addObserver(this);
      }
    }
    // control screen capture & not showing preview in app switcher
    if (!TextUtils.isEmpty(BuildConfig.IS_DISABLE_APP_SWITCHER_PREVIEW)){
      if ("true".equalsIgnoreCase(BuildConfig.IS_DISABLE_APP_SWITCHER_PREVIEW)){
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
      }
    }
  }

}
