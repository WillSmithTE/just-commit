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
                        <TouchableOpacity
                            style={styles.invisibleButton}>
                            <Icon family='MaterialIcons' name='restore-from-trash' color='black' props={{ size: 35 }} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonContainer}>
                        <StartRecordingIcon start={startRecording} stop={stopRecording} isRecording={isRecording} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={Object.assign({}, styles.flipButton, isRecording ? styles.invisibleButton : {})}
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

const maxCircleSize = 125
const outerCircleSize = 90
const innerCircleSize = 75

const mode1 = {
    key: 1,
    backgroundColor: "#3d5875",
    tintColor: '#00e0ff'
}
const mode2 = {
    key: 2,
    backgroundColor: "#00e0ff",
    tintColor: '#3d5875'
}

const StartRecordingIcon = ({ isRecording, start, stop }: { isRecording: boolean, start: () => void, stop: () => void }) => {
    const [mode, setMode] = useState(mode1)

    return <>
        <Pressable onPressIn={start} onPressOut={stop}>
            {isRecording && <AnimatedCircularProgress
                key={new Date().toString()}
                size={maxCircleSize}
                width={20}
                duration={10 * 1000}
                fill={100}
                tintColor={mode.tintColor}
                onAnimationComplete={() => setMode(mode === mode1 ? mode2 : mode1)}
                backgroundColor={mode.backgroundColor}
                style={{ transform: [{ rotate: '270deg' }] }}
            />}
            <View style={{ ...circleStyles.circleContainer, paddingTop: isRecording ? 0 : 20 }}>
                {!isRecording && <View style={circleStyles.outerCircle} />}
                <View style={circleStyles.innerCircle} />
            </View>
        </Pressable>
    </>
}

const circleStyles = StyleSheet.create({
    circleContainer: {
        alignSelf: 'center',
    },
    outerCircle: {
        borderRadius: outerCircleSize / 2,
        width: outerCircleSize,
        height: outerCircleSize,
        borderColor: 'white',
        borderWidth: 3,
        // position: 'absolute',
        bottom: (maxCircleSize - outerCircleSize) / 2,
        alignSelf: 'center',
        elevation: 100,
    },
    innerCircle: {
        elevation: 100,
        borderRadius: innerCircleSize / 2,
        width: innerCircleSize,
        height: innerCircleSize,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: (maxCircleSize - innerCircleSize) / 2,
        alignSelf: 'center',
    }
});

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
    invisibleButton: {
        opacity: 0,
        height: 0,
        marginRight: 12,
        marginBottom: 12,
    },
    recordButton: {
        // marginLeft: 'auto',
        // marginTop: 'auto'
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
