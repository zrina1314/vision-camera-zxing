# vision-camera-zxing

A barcode reading frame processor plugin for Vision Camera using ZXing.

It uses [ZXing Android Embedded](https://github.com/journeyapps/zxing-android-embedded) for Android and [ZXingObjC](https://github.com/zxingify/zxingify-objc) for iOS.

## Installation

```sh
npm install vision-camera-zxing
cd ios && pod install
```

Add the plugin to your `babel.config.js`:

```js
module.exports = {
   plugins: [['react-native-worklets-core/plugin']],
    // ...
```

> Note: You have to restart metro-bundler for changes in the `babel.config.js` file to take effect.

## Usage

1. Scan barcodes with vision camera.
   
   ```js
   import { zxing } from 'vision-camera-zxing';
 
   // ...
   const frameProcessor = useFrameProcessor((frame) => {
     'worklet';
     const barcodes = zxing(frame);
   }, []);
   ```
   
2. Scan barcodes from a base64-encoded static image.

   ```ts
   let results = await decodeBase64(base64);
   ```

## Limitation

ZXing has a requirement of the direction of the barcode to scan and cannot return the exact barcode region.

You can use [Dynamsoft Barcode Reader](https://github.com/tony-xlh/vision-camera-dynamsoft-barcode-reader) instead to meet your needs.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
