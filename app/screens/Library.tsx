import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { showComingSoon } from '../components/Error';
import { RecordingsList } from '../components/RecordingsList';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types'

export default function Library({ }: RootTabScreenProps<'Record'>) {
  const navigation = useNavigation()
  const onPressSearch = () => {
    showComingSoon()
  }
  const onPressSettings = () => {
    navigation.navigate('Settings')
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <>
          <View style={styles.topRow}>
            <View style={{ backgroundColor: 'black' }}><Text style={styles.title}>Your Library</Text></View>
            <View style={{ backgroundColor: 'black', flexDirection: 'row' }}>
              <IconButton icon='magnify' size={25} onPress={onPressSearch} color='white' />
              <IconButton icon='cog-outline' size={25} onPress={onPressSettings} color='white' />
            </View>
          </View>
          <RecordingsList />
        </>
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
  topRow: {
    flexDirection: 'row',
    backgroundColor: 'black',
    paddingTop: 25,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
  },
});
