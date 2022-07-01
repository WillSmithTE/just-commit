import * as React from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Icon from './Icon';
import { formatTime, useTimer } from './useTimer'
import Toast from 'react-native-root-toast';
import { useDispatch } from 'react-redux';
import { addSong } from '../services/songSlice';
import { api } from '../services/api';

export const Recorder = () => {
    const [recording, setRecording] = React.useState<Audio.Recording | undefined>();
    const [stopwatchReset, setReset] = React.useState(false)

    const dispatch = useDispatch()
    const { timer, isActive, isPaused, handleStart, handlePause, handleResume, handleReset } = useTimer(0)

    async function startRecording() {
        const start = performance.now()
        try {
            console.log(`t1 ${performance.now() - start}`)
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            console.log(`t2 ${performance.now() - start}`)

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log(`t3 ${performance.now() - start}`)

            console.log('Starting recording..');
            handleStart()
            console.log(`t4 ${performance.now() - start}`)

            const {recording} = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
            setRecording(recording)

            console.log(`t5 ${performance.now() - start}`)

            console.log('Recording started');
            console.log(`t6 ${performance.now() - start}`)

        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    async function stopRecording() {
        console.log('Stopping recording..');
        handleReset()
        setRecording(undefined);
        await recording!!.stopAndUnloadAsync();
        const uri = recording!!.getURI();
        showSuccessfulRecording(`Recording saved`)
        console.log(`Recording stopped (uri=${uri}, time=${timer})`);
        setRecording(undefined)
        const saved = await api.saveSong({uri: uri!!, durationSeconds: timer})
        dispatch(addSong(saved))
    }

    return (
        <View style={styles.container}>
            {/* <Stopwatch start={!!recording} reset={stopwatchReset} options={stopwatchStyle} getMsecs={stopwatchGetTime} /> */}
            <View><Text style={stopwatchStyle.text}>{formatTime(timer)}</Text></View>
            <TouchableOpacity onPress={isActive ? stopRecording : startRecording}>
                {isActive ? <StopIcon /> : <StartIcon />}
            </TouchableOpacity>
        </View>
    );
}

const StartIcon = () => <Icon family='MaterialCommunityIcons' name='record-circle' color='red' props={{ size: 150 }} />

const StopIcon = () => <Icon family='MaterialCommunityIcons' name='stop-circle' color='red' props={{ size: 150 }} />

const showSuccessfulRecording = (message: string) => {
    Toast.show(message, {
        duration: Toast.durations.LONG,
        textColor: 'white',
        backgroundColor: 'green'
    });
}
const stopwatchStyle = {
    container: {
        backgroundColor: '#000',
        paddingBottom: 80,
    },
    text: {
        fontSize: 60,
        color: 'white',
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})  