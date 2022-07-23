import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { persistor, store } from './services/reduxStore';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider as PaperProvider } from 'react-native-paper';
import { loadFonts } from './hooks/usePreloadResources';
import * as SplashScreen from 'expo-splash-screen';
import { Entypo } from '@expo/vector-icons';

const queryClient = new QueryClient()
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts()
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    SplashScreen.hideAsync()
  }, [appIsReady])

  if (!appIsReady) {
    return null;
  }

  return (
    <RootSiblingParent>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider>
            <AppInternals />
          </PaperProvider>
        </PersistGate>
      </Provider>
    </RootSiblingParent>
  );
}

const AppInternals = () => {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation colorScheme={colorScheme} />
      <StatusBar />
    </QueryClientProvider>
  );
}

const { width, height } = Dimensions.get('screen');
const styles = StyleSheet.create({
  img: {
    width,
    height,
  },
});
