import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Text, View, AsyncStorage } from 'react-native';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
// import AsyncStorage from '@react-native-community/async-storage';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from 'apollo-boost';
import apolloClientOptions from './apollo'; 
import { ApolloProvider } from 'react-apollo-hooks';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);

  // preload
  const preLoad = async () => {
    try {
      await Font.loadAsync({
        ...Ionicons.font
      });
      await Asset.loadAsync([require("./assets/logo.png")]);

      const cache = new InMemoryCache();

      // await before instantiating ApolloClient, else queries might run before the cache is persisted
      await persistCache({
        cache,
        storage: AsyncStorage,
      });
      
      // Continue setting up Apollo as usual.
      const client = new ApolloClient({
        cache,
        ...apolloClientOptions
      });

      setLoaded(true);
      setClient(client);

    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    preLoad();
  }, []);

  // check loaded and client called
  return loaded && client ? (
    <ApolloProvider client={client}>
      <View style={{ top: '10%', left: '10%'}}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>It works!</Text>
      </View>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
