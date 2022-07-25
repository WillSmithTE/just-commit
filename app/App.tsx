import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { persistor, store } from './services/reduxStore';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Dimensions, StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { PersistGate } from 'redux-persist/integration/react'
import { Provider as PaperProvider } from 'react-native-paper';
import { loadFonts } from './hooks/usePreloadResources';
import * as SplashScreen from 'expo-splash-screen';

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

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <RootSiblingParent>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <PaperProvider>
              <AppInternals />
            </PaperProvider>
          </PersistGate>
        </Provider>
      </RootSiblingParent>
    </View>
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
