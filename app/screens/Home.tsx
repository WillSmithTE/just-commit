import { isDevice } from 'expo-device';
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { RecordingsList } from '../components/RecordingsList';
import { Text, View } from '../components/Themed';
import { upsertMedia } from '../services/mediaSlice';
import { MyMedia, RootTabScreenProps } from '../types'

export default function Home({ navigation }: RootTabScreenProps<'Home'>) {
  const oneWeekInFuture = new Date(new Date().getDate() + 7)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isDevice) {
      dispatch(upsertMedia({
        creationTime: 1,
        duration: 20,
        filename: 'herpderp.mp4',
        height: 20,
        id: new Date().toString(),
        mediaType: 'video',
        modificationTime: 20,
        uri: '1234',
        width: 10,
        type: 'audio',
      }))
      dispatch(upsertMedia({
        creationTime: 1,
        duration: 20,
        filename: 'herpderp.mp4',
        height: 20,
        id: new Date().toString(),
        mediaType: 'video',
        modificationTime: 20,
        uri: '1234',
        width: 10,
        type: 'video',
      }))
    }
  })
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Hej hej</Text>
        <RecordingsList shouldDisplayItem={(media: MyMedia) => !media.isDone} />
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
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 10,
    paddingLeft: 10,
    // marginRight: 'auto',
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
