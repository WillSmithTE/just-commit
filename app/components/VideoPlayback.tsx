import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import Icon from './Icon';
import { useEffect, useState } from 'react';
import { SaveEditModal } from './SaveEditModal';
import { AtLeast, MyVideo, RootStackScreenProps } from '../types';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { isDevice } from 'expo-device';
import { deleteMedia } from '../services/mediaSlice';

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
        console.log(`playbackStatus=${JSON.stringify(status, null, 2)}`)
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
        if (isNewVideo) {
            console.error('shouldnt be here')
        } else {
            Alert.alert('Are you sure?', undefined, [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: isNewVideo ? 'Discard' : 'Delete', onPress: () => {
                        dispatch(deleteMedia(selectedVideo.id!!))
                        exit()
                    }
                },
            ])
        }
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
            <TouchableOpacity
                style={styles.closeButton}
                onPress={pressExit}>
                <Icon family='MaterialCommunityIcons' name='chevron-left' color='white' props={{ size: 60 }} />
            </TouchableOpacity>
        </View>
        {
            status?.isLoaded ?
                <>
                    <View style={styles.bottomRow}>
                        <TouchableOpacity onPress={deleteVideo} style={isNewVideo ? styles.invisibleButton : styles.trashButton}>
                            <Icon family='Entypo' name='trash' color='white' size={70} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            status?.isPlaying ?
                                playbackVideo.current!!.pauseAsync().catch(console.error)
                                : playbackVideo.current!!.playAsync().catch(console.error)
                        }>
                            {status.isPlaying ?
                                <Icon family='Ionicons' name='pause-circle' color='red' size={90} /> :
                                <Icon family='Ionicons' name='play-circle' color='red' size={90} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pressEdit} style={styles.tickButton}>
                            {isNewVideo ?
                                <Icon family='MaterialCommunityIcons' name='content-save' color='white' size={70} /> :
                                <Icon family='MaterialCommunityIcons' name='pencil-box-outline' color='white' size={70} />}
                        </TouchableOpacity>
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
        marginBottom: 12,
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
        backgroundColor: '#2196F3',
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
