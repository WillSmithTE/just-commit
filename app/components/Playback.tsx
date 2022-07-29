import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, BackHandler, ImageBackground } from 'react-native';
import { AVPlaybackStatus, ResizeMode, Video, Audio } from 'expo-av';
import Icon from './Icon';
import { useEffect, useState } from 'react';
import { SaveEditModal } from './SaveEditModal';
import { AtLeast, AtLeast2, MyMedia, RootStackScreenProps } from '../types';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { isDevice } from 'expo-device';
import { deleteMedia } from '../services/mediaSlice';
import { Button, FAB, IconButton } from 'react-native-paper';
import { PINK_COLOUR } from '../constants';
import { showError, showError2 } from './Error';

type VideoPlaybackProps = RootStackScreenProps<'Playback'> & {
    media: AtLeast2<MyMedia, 'uri', 'type'>,
}

export const Playback = ({ route: { params: { media, inEditMode } } }: VideoPlaybackProps) => {
    const playbackVideo = React.useRef<Video>(null)
    const [playbackAudio, setPlaybackAudio] = useState<Audio.Sound | undefined>()
    const [status, setStatus] = useState<AVPlaybackStatus | undefined>();
    const [isSaveModalVisible, setSaveModalVisible] = useState(inEditMode === true)
    const navigation = useNavigation();

    const playback = media.type === 'video' ? playbackVideo.current : playbackAudio

    media.type === 'video' && React.useMemo(() => {
        if (status?.isLoaded === true) {
            console.debug('playing now')
            playback!!.playAsync().catch(console.error)
        }
    }, [status?.isLoaded])

    useEffect(() => {
        (async () => {
            if (media.type === 'audio') {
                console.debug(`initialising sound`)
                const { sound, status } = await Audio.Sound.createAsync(
                    { uri: media.uri, },
                    {},
                    setStatus,
                );
                // await sound.setPositionAsync(0);
                setPlaybackAudio(sound)
                await sound.playAsync()
            }
        })()
    }, [])
    useEffect(() => {
        console.debug(`status=${JSON.stringify(status, null, 2)}`)
        if (status?.isLoaded && status.didJustFinish) {
            playback!!.setPositionAsync(0)
            playback!!.pauseAsync()
        }
    }, [status])

    useEffect(() => {
        if (!isDevice) {
            setSaveModalVisible(true)
        }
    }, [])

    const dispatch = useDispatch()
    const isNewMedia = media.id === undefined
    const exit = () => navigation.goBack()

    const _deleteMedia = () => {
        Alert.alert('Are you sure?', undefined, [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            {
                text: isNewMedia ? 'Discard' : 'Delete', onPress: () => {
                    !isNewMedia && dispatch(deleteMedia(media.id!!))
                    exit()
                }
            },
        ], { cancelable: true })
    }
    const pressExit = () => {
        if (isNewMedia) {
            _deleteMedia()
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
        {media.type === 'video' && <Video
            ref={playbackVideo}
            style={styles.video}
            source={{ uri: media!!.uri, }}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={newStatus => setStatus(() => newStatus)}
            onError={(error) => showError2({ message: `oops! something went wrong playing your video`, description: error })}
        />}
        {media.type === 'audio' && <ImageBackground
            // style={{ flex: 1 }}
            style={styles.video}
            source={require('../assets/images/roland-kay-smith-GBKpO-rJecg-unsplash.jpg')}>
            {/* {insideElements} */}
        </ImageBackground >
        }
        <View style={styles.buttonContainer}>
            <IconButton
                onPress={pressExit}
                icon='close'
                color='white'
                size={40}
                style={{
                    shadowOffset: { width: 0, height: 0 },
                    shadowColor: 'black',
                    shadowOpacity: .7
                }}
            />
        </View>
        {
            status?.isLoaded ?
                <>
                    <View style={styles.bottomRow}>
                        <IconButton icon='delete' style={isNewMedia ? styles.invisibleButton : styles.trashButton} onPress={deleteMedia} color='white' size={50} />
                        <TouchableOpacity onPress={() => console.log({ status, playback, type: media.type }) ||
                            status?.isPlaying ?
                            playback!!.pauseAsync().catch(console.error)
                            : playback!!.playAsync().catch(console.error)
                        }>
                            {status.isPlaying ?
                                <Icon family='Ionicons' name='pause-circle' color={PINK_COLOUR} size={90} /> :
                                <Icon family='Ionicons' name='play-circle' color={PINK_COLOUR} size={90} />
                            }
                        </TouchableOpacity>
                        <IconButton icon={isNewMedia ? 'chevron-right-circle' : 'pencil-box-outline'} size={50} color='white'
                            onPress={pressEdit} style={styles.tickButton} />
                    </View>
                </> :
                <Loading />
        }
        <SaveEditModal isVisible={isSaveModalVisible} setVisible={setSaveModalVisible} media={media!!} />
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

