import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import usePreloadResources from './hooks/usePreloadResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { persistor, store } from './services/reduxStore';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Dimensions, Image, StyleSheet } from 'react-native';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react'

const queryClient = new QueryClient()

export default function App() {
  return (
    <RootSiblingParent>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppInternals />
        </PersistGate>
      </Provider>
    </RootSiblingParent>
  );
}

const AppInternals = () => {
  // const isLoadingComplete = usePreloadResources();
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
