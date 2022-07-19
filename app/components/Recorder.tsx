import * as React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from './Icon';
import { useEffect, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';

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
        setIsRecording(true)
        const { uri } = await camera!!.recordAsync()
        // setCamera(undefined)
        console.log(`new recording (uri=${uri}`);
        navigation.navigate('Playback', { video: { uri } })
    }

    const stopRecording = async () => {
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
                        <TouchableOpacity
                            style={styles.recordButton}
                            onPress={isRecording ? stopRecording : startRecording}>
                            {isRecording ? <StopRecordingIcon /> : <StartRecordingIcon />}
                        </TouchableOpacity>
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

const StartRecordingIcon = () => <Icon family='MaterialCommunityIcons' name='record-circle' color='red' props={{ size: 150 }} />

const StopRecordingIcon = () => <Icon family='MaterialCommunityIcons' name='stop-circle' color='red' props={{ size: 150 }} />

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
