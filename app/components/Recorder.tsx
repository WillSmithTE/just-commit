import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, Text, Animated } from 'react-native';
import Icon from './Icon';
import { useEffect, useRef, useState } from 'react';
import { Camera, CameraType, VideoCodec } from 'expo-camera';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import * as Device from 'expo-device';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { BLUE_COLOUR } from '../constants';
import { StartRecordingIcon } from './StartRecordingIcon';

export const Recorder = ({ navigation }: { navigation: NavigationProp<ParamListBase, string, any, any> }) => {
    const [isRecording, setIsRecording] = useState(false)
    const [hasPermission, setHasPermission] = useState(false);
    const [type, setType] = useState(CameraType.back);
    const [camera, setCamera] = useState<Camera | undefined>();
    const isFocused = useIsFocused();

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
            setTimeout(() => setIsRecording(true), 200)
            const recording = await camera!!.recordAsync({ codec: VideoCodec.JPEG })
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

    return (
        <>
            {isFocused && <Camera style={styles.camera} type={type} ref={ref => setCamera(ref!!)}>
                <View style={styles.bottomRow}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.modeToggleButton}>
                            <Icon family='MaterialCommunityIcons' name='video' color='white' props={{ size: 35 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <StartRecordingIcon start={startRecording} stop={stopRecording} isRecording={isRecording} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={Object.assign({}, styles.flipButton, isRecording ? styles.modeToggleButton : {})}
                            onPress={() => {
                                setType(type === CameraType.back ? CameraType.front : CameraType.back);
                            }}>
                            <Icon family='MaterialIcons' name='flip-camera-ios' color='white' props={{ size: 35 }} />
                        </TouchableOpacity>
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
        backgroundColor: 'transparent',
        margin: 20,
    },
    closeButton: {
        marginBottom: 'auto',
        marginRight: 'auto',
    },
    modeToggleButton: {
        marginRight: 12,
        marginBottom: 12,
    },
    flipButton: {
        marginRight: 12,
        marginBottom: 12,
    },
    bottomRow: {
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
    deleteButton: {
        marginLeft: 24,
        marginBottom: 12,
    },
    tickButton: {
        marginRight: 24,
        marginBottom: 12,
    },
})  
