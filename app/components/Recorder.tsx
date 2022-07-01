import * as React from 'react';
import { Text, View, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio, AVPlaybackStatus, Video } from 'expo-av';
import Icon from './Icon';
import { formatTime, useTimer } from './useTimer'
import Toast from 'react-native-root-toast';
import { useDispatch } from 'react-redux';
import { addSong } from '../services/songSlice';
import { api } from '../services/api';
import { useEffect, useState } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { RootTabScreenProps } from '../types';
import { VideoPlayback } from './VideoPlayback';
import { NavigationProp, ParamListBase } from '@react-navigation/native';

export const Recorder = ({ navigation }: { navigation: NavigationProp<ParamListBase, string, any, any> }) => {
    const [recordingUri, setRecordingUri] = useState<string | undefined>();
    const [stopwatchReset, setReset] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [hasPermission, setHasPermission] = useState(false);
    const [type, setType] = useState(CameraType.back);
    const [camera, setCamera] = useState<Camera | undefined>();

    const dispatch = useDispatch()

    useEffect(() => {
        (async () => {
            const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
            const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();

            setHasPermission(cameraStatus === 'granted' && audioStatus === 'granted');
        })();
    }, []);

    const startRecording = async () => {
        setIsRecording(true)
        const newUri = (await camera!!.recordAsync()).uri
        console.log(newUri);
        setRecordingUri(newUri);
    }

    const stopRecording = async () => {
        camera!!.stopRecording();
        setIsRecording(false)
    }

    if (hasPermission === null) {
        console.warn(`no permissions for camera recording`)
        return <View />;
    }

    return (!!recordingUri ?
        <VideoPlayback uri={recordingUri} navigation={navigation} /> :
        <Camera style={styles.camera} type={type} ref={ref => setCamera(ref!!)}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}>
                    <Icon family='AntDesign' name='close' color='white' props={{ size: 35 }} />
                </TouchableOpacity>
            </View>
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
