package com.visioncamerazxing;

import android.graphics.Bitmap;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = VisionCameraZXingModule.NAME)
public class VisionCameraZXingModule extends ReactContextBaseJavaModule {
  public static final String NAME = "VisionCameraZXing";
  private static ReactApplicationContext mContext;
  public VisionCameraZXingModule(ReactApplicationContext reactContext) {
    super(reactContext);
    mContext = reactContext;
  }
  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  public static ReactApplicationContext getContext(){
    return mContext;
  }
}
