#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(VisionCameraZXing, NSObject)

RCT_EXTERN_METHOD(decodeBase64:(NSString *)base64
                  config:(NSDictionary *)config
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
