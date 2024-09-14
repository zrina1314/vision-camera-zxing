import * as React from 'react';
import { Button, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native';
import BarcodeScanner from './components/BarcodeScanner';

const Separator = () => (
  <View style={styles.separator} />
);

export default function App() {
  const [useCamera,setUseCamera] = React.useState(false);
  const [continuous, setContinuous] = React.useState(false);
  const toggleSwitch = () => setContinuous(previousState => !previousState);
  

  return (
    <SafeAreaView style={styles.container}>
      {useCamera && (
        <>
          <BarcodeScanner></BarcodeScanner>
          <View
            style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', alignItems: 'center'}}
          >
            <Button
              title="Close"
              onPress={() => setUseCamera(false)}
            />
          </View>
        </>
        
      )}
      {!useCamera &&(
          <View style={{alignItems:"center"}}>
            <Text style={styles.title}>
              Dynamsoft Barcode Reader Demo
            </Text>
            <Button
              title="Read Barcodes from the Camera"
              onPress={() => setUseCamera(true)}
            />
            <Separator />
            <View style={styles.switchView}>
              <Text style={{alignSelf: 'center'}}>
                Continues Scan
              </Text>
              <Switch 
                style={{alignSelf: 'center'}}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={continuous ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={continuous}
              />
            </View>
            <Separator />
          </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  separator: {
    marginVertical: 4,
  },
  switchView: {
    alignItems: 'center',
    flexDirection: "row",
  },
  barcodeText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});