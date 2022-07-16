import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import EditScreenInfo from '../components/EditScreenInfo';
import Icon from '../components/Icon';
import { Recorder } from '../components/Recorder';
import { RecordingsList } from '../components/RecordingsList';
import { Text, View } from '../components/Themed';
import { VideoPlayback } from '../components/VideoPlayback';
import { RootState } from '../services/reduxStore';
import { RootTabScreenProps } from '../types'

export default function Home({ navigation }: RootTabScreenProps<'Home'>) {
  const oneWeekInFuture = new Date(new Date().getDate() + 7)
  const selectedVideo = useSelector((state: RootState) => state.selectedMedia.selectedMedia)

  return (
    // selectedVideo ?
    //   <VideoPlayback video={selectedVideo} /> :
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Coming up...</Text>
        <RecordingsList timeUntil={oneWeekInFuture} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center',

  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 10,
    paddingLeft: 10,
    marginRight: 'auto',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    marginTop: 'auto'
  }
});
