import * as React from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { Camera, CameraType, VideoCodec } from 'expo-camera';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import * as Device from 'expo-device';
import { StartRecordingIcon } from './StartRecordingIcon';
import { FAB, IconButton, Portal, Provider } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';
import { Audio } from 'expo-av';
import { showError2 } from './Error';
import { useSelector } from 'react-redux';
import { RootState } from '../services/reduxStore';
import { Feature, useFeature } from '../hooks/useFeature';

type Mode = 'video' | 'audio'
type ModePickerState = {
    open: boolean,
    mode: Mode,
}

export const Recorder = ({ navigation }: { navigation: NavigationProp<ParamListBase, string, any, any> }) => {
    const [isRecording, setIsRecording] = useState(false)
    const [hasPermission, setHasPermission] = useState(false);
    const [type, setType] = useState(CameraType.back);
    const [camera, setCamera] = useState<Camera | undefined>();
    const isFocused = useIsFocused();
    const [audioRecording, setAudioRecording] = React.useState<Audio.Recording | undefined>();
    const [mode, setMode] = React.useState<Mode>('video');
    const [modePickerOpen, setModePickerOpen] = React.useState(false)
    const isFullRecordScreen = useFeature(Feature.FULL_RECORD_SCREEN)
    useEffect(() => {
        if (mode === 'video')
            (async () => {
                const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
                const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
                setHasPermission(cameraStatus === 'granted' && audioStatus === 'granted');
            })();
        else
            (async () => await Audio.requestPermissionsAsync())()
    }, [mode]);

    const startRecording = async () => {
        if (mode === 'video') {
            startVideoRecording()
        } else {
            startAudioRecording()
        }
    }

    const startVideoRecording = async () => {
        console.debug('starting video recording')
        const startRecordingTime = new Date()
        console.debug({ startRecordingTime: startRecordingTime.getTime() })
        if (Device.isDevice) {
            setTimeout(() => setIsRecording(true), 200)
            const recording = await camera!!.recordAsync() //({ codec: VideoCodec.JPEG, quality: '720p' })
            const recordingTime = (new Date()).getTime() - startRecordingTime?.getTime()
            console.log(`new recording (recording=${JSON.stringify(recording, null, 2)}, recordingTime=${recordingTime}`);
            if (recordingTime < 2000) {
                showMessage({ message: `You'll have to hold it longer, sorry!`, description: 'Video too short', type: 'info' })
            } else {
                navigation.navigate('Playback', { media: { uri: recording.uri, type: mode } })
            }
        } else {
            console.log('emulator, skipping recording')
            navigation.navigate('Playback', { media: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', inEditMode: true, type: mode })
        }
    }

    async function startAudioRecording() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
            setIsRecording(true)
            setAudioRecording(recording)
        } catch (err) {
            showError2({ message: 'Failed to start recording', description: err as string });
        }
    }

    const stopRecording = async () => {
        setIsRecording(false)
        console.debug('stopping recording')
        if (mode === 'video') stopVideoRecording()
        else stopAudioRecording()
    }
    const stopVideoRecording = () => {
        camera!!.stopRecording();
        setIsRecording(false)
    }

    async function stopAudioRecording() {
        await audioRecording!!.stopAndUnloadAsync();
        const uri = audioRecording!!.getURI();
        console.log(`Recording stopped (uri=${uri})`);
        setAudioRecording(undefined)
        navigation.navigate('Playback', { media: { uri, type: mode } })
    }

    if (hasPermission === null) {
        console.error(`no permissions for camera recording`)
        return <View />;
    }

    const insideElements = <>
        <View>
            {isFocused && <ModePicker open={modePickerOpen} setOpen={setModePickerOpen} mode={mode} setMode={setMode} />}
        </View>
        {isFullRecordScreen && <IconButton
            onPress={() => navigation.goBack()}
            icon='close'
            color='white'
            size={40}
            style={{
                shadowOffset: { width: 0, height: 0 },
                shadowColor: 'black',
                shadowOpacity: .7,
                position: 'absolute',
                top: 30,
                left: 10,
            }}
        />}

        <View style={styles.bottomRow}>
            <View style={styles.buttonContainer}>

                <IconButton icon='video-box' color='white' size={35} style={[styles.invisibleButton, styles.leftButton]} />
            </View>
            <View style={styles.buttonContainer}>
                <StartRecordingIcon start={startRecording} stop={stopRecording} isRecording={isRecording} />
            </View>
            <View style={styles.buttonContainer}>
                <IconButton icon='camera-flip' color='white' size={35} style={[styles.rightButton, mode === 'audio' && styles.invisibleButton]}
                    onPress={() => {
                        setType(type === CameraType.back ? CameraType.front : CameraType.back);
                    }} />
            </View>
        </View></>

    return (
        <>
            {mode === 'video' ?
                isFocused && <Camera style={styles.camera} type={type} ref={ref => setCamera(ref!!)}>
                    {insideElements}
                </Camera> :
                <ImageBackground
                    style={{ flex: 1 }}
                    source={require('../assets/images/snow.png')}>
                    {insideElements}
                </ImageBackground >
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        backgroundColor: 'transparent',
        margin: 20,
    },
    closeButton: {
        marginBottom: 'auto',
        marginRight: 'auto',
    },
    leftButton: {
        marginLeft: 12,
        marginBottom: 12,
    },
    invisibleButton: {
        opacity: 0,
    },
    rightButton: {
        marginRight: 12,
        marginBottom: 16,
    },
    bottomRow: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: 'auto',
        alignItems: 'flex-end'
    },
    text: {
        fontSize: 18,
        color: 'white',
    },
    video: {
        alignSelf: 'center',
        width: '100%',
        height: '100%',
    },
})

type ModePickerProps = {
    mode: Mode,
    setMode: (mode: Mode) => void,
    open: boolean,
    setOpen: (open: boolean) => void,
}

const modes: { icon: string, key: Mode }[] = [
    {
        icon: 'microphone',
        key: 'audio',
    },
    {
        icon: 'video',
        key: 'video',
    }
]

const modeIcon = (mode: Mode) => ({
    audio: 'microphone',
    video: 'video',
}[mode])

const ModePicker = ({ mode, setMode, open, setOpen }: ModePickerProps) => {
    const isFocused = useIsFocused();
    const isFabInMiddle = useFeature(Feature.RECORD_FAB_IN_MIDDLE)

    const fullRecordScreen = useFeature(Feature.FULL_RECORD_SCREEN)
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Portal>
                <FAB.Group
                    visible={isFocused}
                    fabStyle={fabStyles(fullRecordScreen, isFabInMiddle).fabStyle}
                    style={fabStyles(fullRecordScreen, isFabInMiddle).groupStyle}
                    open={open}
                    icon={open ? 'plus' : modeIcon(mode)}
                    actions={modes.map((mode) => ({
                        icon: mode.icon,
                        onPress: () => setMode(mode.key)
                    }))}
                    onStateChange={({ open: newOpen }) => setOpen(newOpen)}
                />
            </Portal>
        </View>
    );
};

const fabStyles = (fullRecordScreen: boolean, isFabInMiddle: boolean) => StyleSheet.create({
    fabStyle: {
        marginBottom: fullRecordScreen ? 30 : 80,
        backgroundColor: '#fc034e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupStyle: {
        backgroundColor: 'transparent',
        alignSelf: 'center',
        justifyContent: 'flex-end',
        ...(() => isFabInMiddle ?
            { alignItems: 'center', } :
            { alignItems: 'flex-start' })()
    }
})