import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { Camera, CameraType, VideoCodec } from 'expo-camera';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import * as Device from 'expo-device';
import { StartRecordingIcon } from './StartRecordingIcon';
import { FAB, IconButton, Portal } from 'react-native-paper';

export const Recorder = ({ navigation }: { navigation: NavigationProp<ParamListBase, string, any, any> }) => {
    const [isRecording, setIsRecording] = useState(false)
    const [hasPermission, setHasPermission] = useState(false);
    const [type, setType] = useState(CameraType.back);
    const [camera, setCamera] = useState<Camera | undefined>();
    const isFocused = useIsFocused();

    console.log(`recorder render`)

    console.log({isFocused})

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
            setHasPermission(cameraStatus === 'granted' && audioStatus === 'granted');
        })();
    }, []);

    const startRecording = async () => {
        console.debug('starting recording')
        if (Device.isDevice) {
            // setTimeout(() => setIsRecording(true), 200)
            setIsRecording(true)
            const recording = await camera!!.recordAsync() //({ codec: VideoCodec.JPEG, quality: '720p' })
            console.log(`new recording (recording=${JSON.stringify(recording, null, 2)}`);
            navigation.navigate('Playback', { video: { uri: recording.uri } })
        } else {
            console.log('emulator, skipping recording')
            navigation.navigate('Playback', { video: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4', inEditMode: true })
        }
    }

    const stopRecording = async () => {
        console.debug('stopping recording')
        camera!!.stopRecording();
        setIsRecording(false)
    }

    if (hasPermission === null) {
        console.error(`no permissions for camera recording`)
        return <View />;
    }
    const [modePickerState, setModePickerState] = React.useState({ open: false });

    return (
        <>
            {isFocused && <Camera style={styles.camera} type={type} ref={ref => setCamera(ref!!)} >
                <View>
                    <ModePicker state={modePickerState} setState={setModePickerState} />
                </View>
                <View style={styles.bottomRow}>
                    <View style={styles.buttonContainer}>

                        <IconButton icon='video-box' color='white' size={35} style={styles.invisibleButton} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <StartRecordingIcon start={startRecording} stop={stopRecording} isRecording={isRecording} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <IconButton icon='camera-flip' color='white' size={35} style={styles.flipButton}
                            onPress={() => {
                                setType(type === CameraType.back ? CameraType.front : CameraType.back);
                            }} />
                    </View>
                </View>
            </Camera>
            }
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        // backgroundColor: 'transparent',
        margin: 20,
    },
    closeButton: {
        marginBottom: 'auto',
        marginRight: 'auto',
    },
    invisibleButton: {
        opacity: 0,
        marginLeft: 12,
        marginBottom: 12,
    },
    flipButton: {
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
    state: { open: boolean }
    setState: (state: { open: boolean }) => void
}

const audioMode = {
    icon: 'microphone',
    key: 'audio',
}
const videoMode = {
    icon: 'video',
    key: 'video',
}

const ModePicker = ({ state, setState }: ModePickerProps) => {
    const onStateChange = ({ open }: { open: boolean }) => setState({ open });
    const [mode, setMode] = useState(videoMode)
    const { open } = state;

    return (
        // <View style={{ flex: 1, position: 'absolute', bottom: 0 }}>
        <Portal>
            <FAB.Group
                fabStyle={fabStyles.fabStyle}
                style={fabStyles.groupStyle}
                // style={{ position: 'absolute' }}
                open={open}
                icon={open ? 'plus' : mode.icon}
                actions={[audioMode, videoMode].map((mode) => ({
                    icon: mode.icon,
                    onPress: () => setMode(mode)
                }))}
                onStateChange={onStateChange}
            />
        </Portal>
    );
};

const fabStyles = StyleSheet.create({
    fabStyle: {
        marginBottom: 80,
        marginLeft: 30,
        left: 0,
        bottom: 0,
        backgroundColor: '#fc034e',
        justifyContent: 'center',
        alignItems: 'center'
    },
    groupStyle: {
        left: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
    }
})