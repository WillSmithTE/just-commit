import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EditScreenInfo from '../components/EditScreenInfo';
import { Recorder } from '../components/Recorder';
import { RecordingsList } from '../components/RecordingsList';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types'

export default function Library({ navigation }: RootTabScreenProps<'Record'>) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>Library</Text>
        <RecordingsList />
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
  },
});
