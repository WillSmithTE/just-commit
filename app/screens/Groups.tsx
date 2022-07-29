import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import EditScreenInfo from '../components/EditScreenInfo';
import { GroupsFeed } from '../components/GroupsFeed';
import { Recorder } from '../components/Recorder';
import { RecordingsList } from '../components/RecordingsList';
import { Text, View } from '../components/Themed';
import { RootState } from '../services/reduxStore';
import { RootTabScreenProps } from '../types'

export default function Groups({ navigation }: RootTabScreenProps<'Record'>) {

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.title}>Groups</Text>
        <GroupsFeed />
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
    // alignContent: 'center',
    justifyContent: 'center',
    // textAlign: 'center',
  },
  title: {
    alignSelf: 'center',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    paddingTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
