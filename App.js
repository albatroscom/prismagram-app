import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AppLoading } from 'expo';
import { Text, View, AsyncStorage } from 'react-native';
import * as Font from 'expo-font'; // expo 에서 변경된 내용
import { Asset } from 'expo-asset'; // expo 에서 변경된 내용
// import AsyncStorage from '@react-native-community/async-storage';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';
import ApolloClient from 'apollo-boost';
import { ThemeProvider } from 'styled-components';
import apolloClientOptions from './apollo'; 
import { ApolloProvider } from 'react-apollo-hooks';
import styles from './styles';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [client, setClient] = useState(null);

  // localStorage 에 접근해서 사용자 로그인 여부를 확인해서, 로그인 여부에 따라 다른 router(navigator) 를 리턴하기 위함 
  // 로그인 여부를 체크한후에 로그아웃을 했는지 알아내기 위해서 null 로 기본값 설정 : null - 체크 x, false - 체크 O (로그아웃함), true - 체크 O (로그인함)
  const [isLoggedIn, setIsLoggedIn] = useState(null);

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

      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === null || isLoggedIn === false) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }

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
  return loaded && client && isLoggedIn !== null ? (
    <ApolloProvider client={client}>
      <ThemeProvider theme={styles}>
        <View style={{ top: '10%', left: '10%'}}>
        { isLoggedIn === true ? <Text>I'm In</Text> : <Text>I'm Out</Text> }
        </View>
      </ThemeProvider>
    </ApolloProvider>
  ) : (
    <AppLoading />
  );
}
