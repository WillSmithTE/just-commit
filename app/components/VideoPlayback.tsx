import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AVPlaybackStatus, Video } from 'expo-av';
import Icon from './Icon';
import { useState } from 'react';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { SaveModal } from './SaveModal';

export const VideoPlayback = ({ uri, navigation }: { uri: string, navigation: NavigationProp<ParamListBase, string, any, any> }) => {
    const video = React.useRef<Video>(null);
    const [status, setStatus] = useState<AVPlaybackStatus | undefined>();
    const [isSaveModalVisible, setSaveModalVisible] = useState(false)

    const pressExit = () => {
        Alert.alert('Are you sure?', undefined, [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'Delete', onPress: () => navigation.goBack() },
        ])
    }

    const pressTick = () => {
        console.log('saving..')
        setSaveModalVisible(true)
    }

    return <>
        <Video
            ref={video}
            style={styles.video}
            source={{ uri, }}
            useNativeControls={false}
            resizeMode="contain"
            isLooping={false}
            onPlaybackStatusUpdate={newStatus => setStatus(() => newStatus)}
        />
        <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={pressExit}>
                <Icon family='AntDesign' name='close' color='white' props={{ size: 35 }} />
            </TouchableOpacity>
        </View>
        {
            status?.isLoaded ?
                <>
                    <View style={styles.bottomRow}>
                        <TouchableOpacity style={styles.invisibleButton}>
                            <Icon family='Entypo' name='trash' color='white' size={50} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() =>
                            status?.isPlaying ?
                                video.current!!.pauseAsync().catch(console.error)
                                : video.current!!.playAsync().catch(console.error)
                        }>
                            {status.isPlaying ?
                                <Icon family='Ionicons' name='pause-circle' color='red' size={90} /> :
                                <Icon family='Ionicons' name='play-circle' color='red' size={90} />
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={pressTick} style={styles.tickButton}>
                            <Icon family='Entypo' name='check' color='white' size={50} />
                        </TouchableOpacity>
                        <SaveModal isVisible={isSaveModalVisible} setVisible={setSaveModalVisible} uri={uri} />
                    </View>
                </> :
                <Loading />
        }
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
        // marginBottom: 'auto',
        // marginRight: 'auto',
        zIndex: 10,
        elevation: 50,
        // position: 'absolute',
    },
    invisibleButton: {
        opacity: 0,
        height: 0,
        marginLeft: 24,
        marginBottom: 12,
    },
    recordButton: {
        // marginLeft: 'auto',
        // marginTop: 'auto'
    },
    flipButton: {
        // marginLeft: 'auto',
        marginRight: 12,
        marginBottom: 12,
        // marginTop: 'auto',
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
        marginRight: 24,
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
