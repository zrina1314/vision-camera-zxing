package com.visioncamerazxing;

import android.graphics.Point;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.google.zxing.Result;
import com.google.zxing.ResultPoint;

import java.util.HashMap;
import java.util.Map;

public class Utils {
  public static Map<String, Object> wrapResults(Result result) {
    Map<String, Object> map = new HashMap<>();
    map.put("barcodeText",result.getText());
    map.put("barcodeFormat",result.getBarcodeFormat().name());
    byte[] bytes = result.getRawBytes();
    if (bytes != null) {
      map.put("barcodeBytesBase64", Base64.encodeToString(bytes,Base64.DEFAULT));
    }else{
      map.put("barcodeBytesBase64", "");
    }
    ResultPoint[] points = null;
    try {
      points = result.getResultPoints();
    }catch (Error e) {}
    WritableNativeArray pointsArray = new WritableNativeArray();
    if (points != null){
      for (ResultPoint point: points) {
        WritableNativeMap pointAsMap = new WritableNativeMap();
        pointAsMap.putInt("x", (int) point.getX());
        pointAsMap.putInt("y", (int) point.getY());
        pointsArray.pushMap(pointAsMap);
      }
    }
    map.put("points",pointsArray.toArrayList());
    return map;
  }
}
