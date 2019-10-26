import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Text, View } from 'react-native';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  // preload
  const preLoad = async () => {
    try {
      await Font.loadAsync({
        ...Ionicons.font
      });
      await Asset.loadAsync([require("./assets/app_image.png")]);
      setLoaded(true);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);

  return loaded ? (
    <View style={{ top: '10%', left: '10%'}}>
      <Text>Open up App.js to start working on your app!</Text>
      <Text>It works!</Text>
    </View>
  ) : (
    <AppLoading />
  );
}
