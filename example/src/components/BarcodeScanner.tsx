import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Camera, runAsync, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
import { zxing, type Result } from 'vision-camera-zxing';
import { Worklets} from 'react-native-worklets-core';
interface props {
  onScanned?: (result:Result[]) => void;
}

const BarcodeScanner: React.FC<props> = (props: props) => {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const device = useCameraDevice("back");
  const cameraFormat = useCameraFormat(device, [
    { videoResolution: { width: 1280, height: 720 } },
    { fps: 60 }
  ])
  const frameProcessor = useFrameProcessor(frame => {
    'worklet'
    runAsync(frame, () => {
      'worklet'
      const results = zxing(frame);
      console.log("decode");
      console.log(results);
    })
  }, [])

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'granted');
      setIsActive(true);
    })();
  }, []);
  
  return (
      <>
        {device &&
        hasPermission && (
        <>
            <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isActive}
            format={cameraFormat}
            frameProcessor={frameProcessor}
            resizeMode='contain'
            pixelFormat="yuv"
            />
        </>)}
      </>
  );
}

export default BarcodeScanner;

const styles = StyleSheet.create({
  barcodeText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});