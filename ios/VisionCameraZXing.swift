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
    
    static func wrapResult(result: ZXResult) -> Any {
        var map: [String: Any] = [:]
        map["barcodeText"] = result.text
        map["barcodeFormat"] = nameForBarcodeFormat(result.barcodeFormat)
        map["barcodeBytesBase64"] = ""
        var convertedPoints: [[String:CGFloat]] = []
        let points = result.resultPoints as! [ZXResultPoint]

        for point in points {
            var pointDict: [String:CGFloat] = [:]
            pointDict["x"] = CGFloat(point.x)
            pointDict["y"] = CGFloat(point.y)
            convertedPoints.append(pointDict)
        }
        map["points"] = convertedPoints
        return map
    }
    
    static func nameForBarcodeFormat(_ format: ZXBarcodeFormat) -> String {
        switch format {
        case kBarcodeFormatAztec:
            return "Aztec"
        case kBarcodeFormatCodabar:
            return "Codabar"
        case kBarcodeFormatCode39:
            return "Code 39"
        case kBarcodeFormatCode93:
            return "Code 93"
        case kBarcodeFormatCode128:
            return "Code 128"
        case kBarcodeFormatDataMatrix:
            return "Data Matrix"
        case kBarcodeFormatEan8:
            return "EAN-8"
        case kBarcodeFormatEan13:
            return "EAN-13"
        case kBarcodeFormatITF:
            return "ITF"
        case kBarcodeFormatMaxiCode:
            return "MaxiCode"
        case kBarcodeFormatPDF417:
            return "PDF417"
        case kBarcodeFormatQRCode:
            return "QR Code"
        case kBarcodeFormatRSS14:
            return "RSS 14"
        case kBarcodeFormatRSSExpanded:
            return "RSS Expanded"
        case kBarcodeFormatUPCA:
            return "UPC-A"
        case kBarcodeFormatUPCE:
            return "UPC-E"
        case kBarcodeFormatUPCEANExtension:
            return "UPC/EAN extension"
        default:
            return "Unknown"
        }
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
