import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EditScreenInfo from '../components/EditScreenInfo';
import { Recorder } from '../components/Recorder';
import { RecordingsList } from '../components/RecordingsList';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types'

export default function Record({ navigation }: RootTabScreenProps<'Home'>) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Recorder navigation={navigation} />
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
