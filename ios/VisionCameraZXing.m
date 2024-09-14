#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VisionCameraZXing, NSObject)

RCT_EXTERN_METHOD(decodeBase64:(NSString *)base64
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
