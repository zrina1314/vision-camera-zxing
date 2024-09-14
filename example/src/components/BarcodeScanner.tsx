import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Camera, runAsync, useCameraDevice, useCameraFormat, useFrameProcessor } from 'react-native-vision-camera';
import { zxing, type Result } from 'vision-camera-zxing';
import { Worklets } from 'react-native-worklets-core';
import { Polygon, Svg, Text as SVGText } from 'react-native-svg';
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

  const getPointsData = (lr:Result) => {
    let points = lr.points;
    let pointsData = "";
    for (let index = 0; index < points.length; index++) {
      const point = points[index];
      pointsData = pointsData + point?.x + "," + point?.y + " ";
    }
    return pointsData.trim();
  }
  
  
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
            <Svg style={StyleSheet.absoluteFill} 
              preserveAspectRatio="xMidYMid slice"
              viewBox="0 0 720 1280">
              {barcodeResults.map((barcode, idx) => (
                <Polygon key={"poly-"+idx}
                  points={getPointsData(barcode)}
                  fill="lime"
                  stroke="green"
                  opacity="0.5"
                  strokeWidth="1"
                />
              ))}
              {barcodeResults.map((barcode, idx) => (
                <SVGText key={"text-"+idx}
                  fill="white"
                  stroke="purple"
                  fontSize={720/400*20}
                  fontWeight="bold"
                  x={barcode.points[0]?.x}
                  y={barcode.points[0]?.y}
                >
                  {barcode.barcodeText}
                </SVGText>
              ))}
            
            </Svg>
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