package com.visioncamerazxing;

import android.graphics.Bitmap;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.Result;

@ReactModule(name = VisionCameraZXingModule.NAME)
public class VisionCameraZXingModule extends ReactContextBaseJavaModule {
  public static MultiFormatReader reader = new MultiFormatReader();
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

  public static Result decodeBinaryBitmap(BinaryBitmap bitmap) throws NotFoundException {
    Result result = reader.decode(bitmap);
    return result;
  }
}
