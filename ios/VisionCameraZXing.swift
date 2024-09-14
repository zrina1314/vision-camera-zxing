import ZXingObjC

@objc(VisionCameraZXing)
class VisionCameraZXing: NSObject {
    static var reader: ZXMultiFormatReader = ZXMultiFormatReader()
    @objc(decodeBase64:withResolver:withRejecter:)
    func decodeBase64(base64:String,resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        var returned_results: [Any] = []
        let image = VisionCameraZXing.convertBase64ToImage(base64)
        if image != nil {
            let imageToDecode = image?.cgImage  // Given a CGImage in which we are looking for barcodes
            let source:ZXCGImageLuminanceSource = ZXCGImageLuminanceSource.init(cgImage: imageToDecode)
            let bitmap:ZXBinaryBitmap = ZXBinaryBitmap.binaryBitmap(with: ZXHybridBinarizer.init(source: source)) as! ZXBinaryBitmap
            do {
                let result = try VisionCameraZXing.reader.decode(bitmap)
                returned_results.append(VisionCameraZXing.wrapResult(result: result))
            }
            catch{}
        }
        resolve(returned_results)
    }
    
    static func getBase64FromBytesArray(result:ZXResult) -> String {
        if result.rawBytes != nil {
            let bytes = result.rawBytes
            for index in 0...bytes!.length {
                print(bytes!.array[Int(index)])
            }
        }else{
            print("bytes is empty")
        }
        return ""
    }
    
    static func wrapResult(result: ZXResult) -> Any {
        var map: [String: Any] = [:]
        map["barcodeText"] = result.text
        map["barcodeFormat"] = result.barcodeFormat.rawValue
        map["barcodeBytesBase64"] = VisionCameraZXing.getBase64FromBytesArray(result: result)
        var convertedPoints: [[String:CGFloat]] = []
        let points = result.resultPoints as! [CGPoint]

        for point in points {
            var pointDict: [String:CGFloat] = [:]
            pointDict["x"] = point.x
            pointDict["y"] = point.y
            convertedPoints.append(pointDict)
        }
        map["points"] = points
        return map
    }
    
    static public func convertBase64ToImage(_ imageStr:String) ->UIImage?{
       if let data: NSData = NSData(base64Encoded: imageStr, options:NSData.Base64DecodingOptions.ignoreUnknownCharacters)
       {
           if let image: UIImage = UIImage(data: data as Data)
           {
               return image
           }
       }
       return nil
    }
}
