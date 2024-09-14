import { NativeModules, Platform } from 'react-native';
import { VisionCameraProxy, type Frame, type Point } from 'react-native-vision-camera';

const LINKING_ERROR =
  `The package 'vision-camera-zxing' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const VisionCameraZXing = NativeModules.VisionCameraZXing
  ? NativeModules.VisionCameraZXing
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const plugin = VisionCameraProxy.initFrameProcessorPlugin('zxing',{})

/**
 * Detect barcodes from the camera preview
 */
export function zxing(frame: Frame,config?:ScanConfig):Record<string, Result> {
  'worklet'
  if (plugin == null) throw new Error('Failed to load Frame Processor Plugin "zxing"!')
  if (config) {
    let record:Record<string,any> = {};
    if (config.multiple != undefined && config.multiple != null) {
      record["multiple"] = config.multiple;
    }
    return plugin.call(frame,record) as any;
  }else{
    return plugin.call(frame) as any;
  }
}

/**
 * Detect barcodes from base64
 */
export function decodeBase64(base64:string,config?:ScanConfig): Promise<Result[]> {
  return VisionCameraZXing.decodeBase64(base64,config);
}

export interface ScanConfig {
  multiple?:boolean
}

export interface Result {
  barcodeText:string;
  barcodeFormat:string;
  barcodeBytesBase64:string;
  points:Point[]
}
