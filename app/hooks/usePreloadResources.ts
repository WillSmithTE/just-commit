import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export const loadFonts = async () => await Font.loadAsync({
  ...FontAwesome.font,
  'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
});

// const loadSavedRecordings = async (dispatch: any) => await dispatch(getMediaThunk())
