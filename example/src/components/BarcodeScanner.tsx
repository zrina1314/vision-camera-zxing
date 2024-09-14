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
  const [barcodeResults, setBarcodeResults] = React.useState([] as Result[]);
  const device = useCameraDevice("back");
  const cameraFormat = useCameraFormat(device, [
    { videoResolution: { width: 1280, height: 720 } },
    { fps: 60 }
  ])
  const convertAndSetResults = (results:Record<string,object>) => {
    const keys = Object.keys(results);
    const converted:Result[] = [];
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      if (key) {
        const result = results[key]
        converted.push(result as Result);
      }
    }
    setBarcodeResults(converted);
  }
  const convertAndSetResultsJS = Worklets.createRunOnJS(convertAndSetResults);
  React.useEffect(() => {
    if (props.onScanned && barcodeResults.length>0) {
      props.onScanned(barcodeResults);
    }
  },[barcodeResults])
  const frameProcessor = useFrameProcessor(frame => {
    'worklet'
    runAsync(frame, () => {
      'worklet'
      const results = zxing(frame);
      console.log(results);
      convertAndSetResultsJS(results);
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