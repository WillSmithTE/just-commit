import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EditScreenInfo from '../components/EditScreenInfo';
import Icon from '../components/Icon';
import { Recorder } from '../components/Recorder';
import { RecordingsList } from '../components/RecordingsList';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types'

export default function Home({ navigation }: RootTabScreenProps<'Home'>) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* <RecordingsList /> */}
        <RecordButton navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const RecordButton = ({ navigation }: RootTabScreenProps<'Home'>) =>
  <TouchableOpacity onPress={() => navigation.push('Record')} style={styles.button}>
    <Icon family='MaterialCommunityIcons' name='record-circle' color='red' props={{ size: 150 }} />
  </TouchableOpacity>

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
