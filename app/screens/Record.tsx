import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import EditScreenInfo from '../components/EditScreenInfo';
import { Recorder } from '../components/Recorder';
import { RecordingsList } from '../components/RecordingsList';
import { Text, View } from '../components/Themed';
import { VideoPlayback } from '../components/VideoPlayback';
import { RootState } from '../services/reduxStore';
import { RootTabScreenProps } from '../types'

export default function RecordScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const selectedVideo = useSelector((state: RootState) => state.selectedMedia.selectedMedia)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* {selectedVideo ?
          <VideoPlayback video={selectedVideo} navigation={navigation} /> : */}
          <Recorder navigation={navigation} />
        {/* } */}
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
