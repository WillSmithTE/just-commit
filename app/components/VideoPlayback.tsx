import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, BackHandler } from 'react-native';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import Icon from './Icon';
import { useEffect, useState } from 'react';
import { SaveEditModal } from './SaveEditModal';
import { AtLeast, MyVideo, RootStackScreenProps } from '../types';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { isDevice } from 'expo-device';
import { deleteMedia } from '../services/mediaSlice';
import { Button, FAB, IconButton } from 'react-native-paper';

type VideoPlaybackProps = RootStackScreenProps<'Playback'> & {
    vide: AtLeast<MyVideo, 'uri'>,
}

export const VideoPlayback = ({ route: { params: { video: selectedVideo, inEditMode } } }: VideoPlaybackProps) => {
    const playbackVideo = React.useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus | undefined>();
    const [isSaveModalVisible, setSaveModalVisible] = useState(inEditMode === true)
    const navigation = useNavigation();

    React.useMemo(() => {
        if (status?.isLoaded === true) {
            playbackVideo.current!!.playAsync().catch(console.error)
        }
    }, [status?.isLoaded])

    useEffect(() => {
        if (status?.isLoaded && status.didJustFinish) {
            playbackVideo.current!!.setPositionAsync(0)
            playbackVideo.current!!.pauseAsync()
        }
    }, [status])

    useEffect(() => {
        if (!isDevice) {
            setSaveModalVisible(true)
        }
    }, [])

    const dispatch = useDispatch()
    const isNewVideo = selectedVideo.id === undefined
    const exit = () => navigation.goBack()

    const deleteVideo = () => {
        Alert.alert('Are you sure?', undefined, [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            {
                text: isNewVideo ? 'Discard' : 'Delete', onPress: () => {
                    !isNewVideo && dispatch(deleteMedia(selectedVideo.id!!))
                    exit()
                }
            },
        ])
    }
    const pressExit = () => {
        if (isNewVideo) {
            deleteVideo()
        } else
            exit()
    }

    const pressEdit = () => {
        setSaveModalVisible(true)
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            pressExit()
            return true
        });
        return () => backHandler.remove();
    }, []);

    return <>
        <Video
            ref={playbackVideo}
            style={styles.video}
            source={{ uri: selectedVideo!!.uri, }}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={newStatus => setStatus(() => newStatus)}
        />
        <View style={styles.buttonContainer}>
            <IconButton
                // style={styles.closeButton}
                onPress={pressExit}
                icon='close'
                color='white'
                size={40}
            />
            {/* <Icon family='MaterialCommunityIcons' name='close' color='white' props={{ size: 50 }} /> */}
            {/* </TouchableOpacity> */}
        </View>
        {
            status?.isLoaded ?
                <>
                    <View style={styles.bottomRow}>
                        <TouchableOpacity onPress={deleteVideo} style={isNewVideo ? styles.invisibleButton : styles.trashButton}>
                            <Icon family='Entypo' name='trash' color='white' size={50} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            status?.isPlaying ?
                                playbackVideo.current!!.pauseAsync().catch(console.error)
                                : playbackVideo.current!!.playAsync().catch(console.error)
                        }>
                            {status.isPlaying ?
                                <Icon family='Ionicons' name='pause-circle' color='#fc034e' size={90} /> :
                                <Icon family='Ionicons' name='play-circle' color='#fc034e' size={90} />
                            }
                        </TouchableOpacity>
                        <IconButton icon={isNewVideo ? 'chevron-right-circle' : 'pencil-box-outline'} size={50} color='#fc034e'
                            onPress={pressEdit} style={styles.tickButton} />
                    </View>
                </> :
                <Loading />
        }
        <SaveEditModal isVisible={isSaveModalVisible} setVisible={setSaveModalVisible} video={selectedVideo!!} />
    </>
}

const Loading = () => <View>
    <ActivityIndicator />
</View>

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
        zIndex: 10,
        elevation: 50,
    },
    invisibleButton: {
        opacity: 0,
        height: 0,
        marginLeft: 36,
        marginBottom: 24,
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
        // alignSelf: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
    },
    tickButton: {
        marginRight: 36,
        marginBottom: 24,
    },
    trashButton: {
        marginLeft: 36,
        marginBottom: 24,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        alignSelf: 'flex-start',
        height: 50,
        width: 50,
        // backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
})

