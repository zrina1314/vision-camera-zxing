//
//  ZXingFrameProcessorPlugin.swift
//  VisionCameraZXing
//
//  Created by xulihang on 2024/9/14.
//  Copyright © 2024 Facebook. All rights reserved.
//

import Foundation
import ZXingObjC

@objc(ZXingFrameProcessorPlugin)
public class ZXingFrameProcessorPlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable : Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable : Any]?) -> Any {
    var returned_results: [Any] = []
    guard let imageBuffer = CMSampleBufferGetImageBuffer(frame.buffer) else {
        print("Failed to get image buffer from sample buffer.")
        return returned_results
    }

    let ciImage = CIImage(cvPixelBuffer: imageBuffer)
  
    guard let cgImage = CIContext().createCGImage(ciImage, from: ciImage.extent) else {
        print("Failed to create bitmap from image.")
        return returned_results
    }
    let source:ZXCGImageLuminanceSource = ZXCGImageLuminanceSource.init(cgImage: cgImage)
    let bitmap:ZXBinaryBitmap = ZXBinaryBitmap.binaryBitmap(with: ZXHybridBinarizer.init(source: source)) as! ZXBinaryBitmap
    do {
        let result = try VisionCameraZXing.reader.decode(bitmap)
        returned_results.append(VisionCameraZXing.wrapResult(result: result))
    }
    catch{}
    return returned_results
  }
}
