package com.visioncamerazxing;
import android.graphics.Bitmap;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.NotFoundException;
import com.google.zxing.PlanarYUVLuminanceSource;
import com.google.zxing.Result;
import com.google.zxing.common.HybridBinarizer;
import com.mrousavy.camera.core.FrameInvalidError;
import com.mrousavy.camera.frameprocessors.Frame;
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin;
import com.mrousavy.camera.frameprocessors.VisionCameraProxy;

import java.io.File;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ZXingFrameProcessorPlugin extends FrameProcessorPlugin {
  ZXingFrameProcessorPlugin(@NonNull VisionCameraProxy proxy, @Nullable Map<String, Object> options) {super();}

  @Nullable
  @Override
  public Object callback(@NonNull Frame frame, @Nullable Map<String, Object> arguments) {
    List<Object> array = new ArrayList<>();
    Boolean multiple = false;
    if (arguments != null) {
      if (arguments.containsKey("multiple")) {
        multiple = (Boolean) arguments.get("multiple");
      }
    }
    try {
      ByteBuffer buffer = frame.getImage().getPlanes()[0].getBuffer();
      int length = buffer.remaining();
      byte[] bytes = new byte[length];
      buffer.get(bytes);
      PlanarYUVLuminanceSource source = new PlanarYUVLuminanceSource(
        bytes,
        frame.getWidth(),
        frame.getHeight(),
        0,
        0,
        frame.getWidth(),
        frame.getHeight(),
        false
      );
      BinaryBitmap binaryBitmap = new BinaryBitmap(new HybridBinarizer(source));
      try {
        if (multiple) {
          Result[] results = VisionCameraZXingModule.decodeBinaryBitmapMultiple(binaryBitmap);
          for (Result result:results) {
            array.add(Utils.wrapResults(result).toHashMap());
          }
        }else{
          Result result = VisionCameraZXingModule.decodeBinaryBitmap(binaryBitmap);
          array.add(Utils.wrapResults(result).toHashMap());
        }
      }catch (NotFoundException e){}
    } catch (FrameInvalidError e) {
      throw new RuntimeException(e);
    }
    return array;
  }
}


