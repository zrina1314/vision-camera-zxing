//
//  ZXingFrameProcessorPlugin.m
//  VisionCameraZXing
//
//  Created by xulihang on 2024/9/14.
//  Copyright © 2024 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>
#import <VisionCamera/Frame.h>
#import "VisionCameraZXing-Swift.h"
#import "VisionCameraZXing-Bridging-Header.h"

@interface ZXingFrameProcessorPlugin (FrameProcessorPluginLoader)
@end

@implementation ZXingFrameProcessorPlugin (FrameProcessorPluginLoader)

+ (void)load
{
    [FrameProcessorPluginRegistry addFrameProcessorPlugin:@"zxing"
                                        withInitializer:^FrameProcessorPlugin* (VisionCameraProxyHolder* proxy, NSDictionary* options) {
        return [[ZXingFrameProcessorPlugin alloc] initWithProxy:proxy withOptions:options];
    }];
}

@end

