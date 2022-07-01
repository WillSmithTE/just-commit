import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import usePreloadResources from './hooks/usePreloadResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { store } from './services/reduxStore';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Dimensions, Image, StyleSheet } from 'react-native';

const queryClient = new QueryClient()

export default function App() {
  const colorScheme = useColorScheme();

  return (
      <RootSiblingParent>
        <Provider store={store}>
          <AppInternals />
        </Provider>
      </RootSiblingParent>
  );
}

// just to get the loading stuff inside the redux provider
const AppInternals = () => {
  const isLoadingComplete = usePreloadResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <QueryClientProvider client={queryClient}>
          <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </QueryClientProvider>
    );
  }

}

const { width, height } = Dimensions.get('screen');
const styles = StyleSheet.create({
  img: {
    width,
    height,
  },
});
