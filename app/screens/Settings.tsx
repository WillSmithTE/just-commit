import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { IconButton, Switch } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import EditScreenInfo from '../components/EditScreenInfo';
import { showComingSoon } from '../components/Error';
import { Recorder } from '../components/Recorder';
import { RecordingsList } from '../components/RecordingsList';
import { Text, View } from '../components/Themed';
import { RootState } from '../services/reduxStore';
import { setFeature } from '../services/settingsSlice';
import { RootTabScreenProps } from '../types'

const features = [
  {
    label: 'Version 2: Save & Edit',
    key: 'v2-save-edit',
  },
  {
    label: 'Nothing',
    key: 'nothing',
  },
]

export default function Settings({ }: RootTabScreenProps<'Record'>) {
  const savedFeatures = useSelector((state: RootState) => state.settings.features)
  const displayFeatures = features.map((feature) => ({
    ...feature,
    enabled: savedFeatures[feature.key]
  }))
  const navigation = useNavigation()
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View style={styles.container}> */}
      <><Text style={styles.title}>Settings</Text></>
      <IconButton
        onPress={() => navigation.goBack()}
        icon='arrow-left'
        color='white'
        size={30}
        style={{
          shadowOffset: { width: 0, height: 0 },
          shadowColor: 'black',
          shadowOpacity: .7,
          position: 'absolute',
          top: 30,
          left: 10,
        }}
      />
      <ScrollView
        style={styles.settingsList}
        contentContainerStyle={{
          paddingTop: 20,
          backgroundColor: 'black',
          flex: 1,
        }}
        showsVerticalScrollIndicator
      >
        {displayFeatures.map((feature, i) => {
          const dispatch = useDispatch()
          const onToggleSwitch = (newVal: boolean) => { dispatch(setFeature({ key: feature.key, enabled: newVal })) };

          return <View key={i} style={{
            flexDirection: 'row',
            borderBottomColor: 'grey',
            padding: 10,
            paddingTop: 0,
            borderWidth: 2,
            backgroundColor: 'black',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Text style={{ color: 'white', fontSize: 16 }}>{feature.label}</Text>
            <Switch value={feature.enabled} onValueChange={onToggleSwitch} ios_backgroundColor='#777a78' trackColor={{ false: '#777a78' }}/>
          </View>
        })}
      </ScrollView>
      {/* </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'black',
    paddingLeft: 20,
    paddingRight: 20,
  },
  topRow: {
    flexDirection: 'row',
    backgroundColor: 'black',
    paddingTop: 10,
    paddingLeft: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    padding: 10,
    paddingBottom: 20,
    alignSelf: 'center',
  },
  settingsList: {
    flex: 1,
    backgroundColor: 'white',
  }
});
