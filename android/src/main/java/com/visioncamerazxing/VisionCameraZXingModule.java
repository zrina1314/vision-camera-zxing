package com.visioncamerazxing;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.module.annotations.ReactModule;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.PlanarYUVLuminanceSource;
import com.google.zxing.RGBLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.multi.GenericMultipleBarcodeReader;
import com.google.zxing.multi.MultipleBarcodeReader;

@ReactModule(name = VisionCameraZXingModule.NAME)
public class VisionCameraZXingModule extends ReactContextBaseJavaModule {
  public static MultiFormatReader reader = new MultiFormatReader();
  public static MultipleBarcodeReader multipleReader = new GenericMultipleBarcodeReader(reader);
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

  public static Result[] decodeBinaryBitmapMultiple(BinaryBitmap bitmap) throws NotFoundException {
    Result[] results = multipleReader.decodeMultiple(bitmap);
    return results;
  }

  @ReactMethod
  public void decodeBase64(String base64, ReadableMap config, Promise promise) {
    try {
      Bitmap bitmap = BitmapUtils.base642Bitmap(base64);
      Boolean multiple = false;
      if (config != null) {
        if (config.hasKey("multiple")) {
          multiple = config.getBoolean(("multiple"));
        }
      }

      int width = bitmap.getWidth();
      int height = bitmap.getHeight();
      int[] pixels = new int[width * height];
      bitmap.getPixels(pixels, 0, width, 0, 0, width, height);
      RGBLuminanceSource source = new RGBLuminanceSource(width, height, pixels);
      BinaryBitmap binaryBitmap = new BinaryBitmap(new HybridBinarizer(source));
      WritableNativeArray array = new WritableNativeArray();
      try {
        if (multiple) {
          Result[] results = decodeBinaryBitmapMultiple(binaryBitmap);
          for (Result result:results) {
            array.pushMap(Utils.wrapResults(result));
          }
        }else{
          Result result = decodeBinaryBitmap(binaryBitmap);
          array.pushMap(Utils.wrapResults(result));
        }
      } catch (NotFoundException e) {}
      promise.resolve(array);
    } catch (Error e) {
      e.printStackTrace();
      promise.reject("ZXING",e.getMessage());
    }
  }
}
