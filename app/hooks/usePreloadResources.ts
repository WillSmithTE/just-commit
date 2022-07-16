import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMediaThunk } from '../services/mediaSlice';

export default function usePreloadResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const dispatch = useDispatch()

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        console.log('fetching async resources')
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Promise.all([
          loadFonts(),
          loadSavedRecordings(dispatch),
        ])
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}

const loadFonts = async () => await Font.loadAsync({
  ...FontAwesome.font,
  'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
});

const loadSavedRecordings = async (dispatch: any) => await dispatch(getMediaThunk())
