import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { Recorder } from '../components/Recorder';
import { View } from '../components/Themed';
import { RootState } from '../services/reduxStore';
import { RootTabScreenProps } from '../types'

export default function RecordScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const selectedVideo = useSelector((state: RootState) => state.selectedMedia.selectedMedia)

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
