import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { MyMedia } from '../types';
import { secondsToMin } from '../services/timeUtil';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Button, Divider, IconButton, Menu } from 'react-native-paper';
import { BLUE_COLOUR } from '../constants';
import { useDispatch } from 'react-redux';
import { deleteMedia, setMediaDone } from '../services/mediaSlice';
import { showMessage, hideMessage } from "react-native-flash-message";
import { showComingSoon } from './Error';

export const RecordingSummary = ({ media, }: { media: MyMedia }) => {
    const [isMenuVisible, setIsMenuVisible] = React.useState(false);

    const [sound, setSound] = React.useState<Audio.Sound | undefined>();
    const [isPlaying, setIsPlaying] = React.useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch()

    const finish = () => {
        setIsPlaying(false)
        sound?.unloadAsync()
        setSound(undefined)
    }

    React.useEffect(() => {
        return sound
            ? finish
            : undefined;
    }, [sound]);

    const onPressDone = () => {
        dispatch(setMediaDone({ id: media.id, done: !media.isDone }))
        showMessage({ message: `Done! You're a star ✨`, type: 'success' })
    }

    return (
        <TouchableOpacity onPress={() => navigation.navigate('Playback', { media })} >
            <View style={styles.container} >
                <View style={styles.imageContainer}>
                    <Image source={willsmithImageSource} style={styles.image} />
                </View>
                <View style={{ flexDirection: 'column', marginRight: 'auto', flex: 1 }}>
                    <View>
                        <Text style={styles.title}>
                            {titleDisplay(media)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.duration}>{timeDisplay(media)}</Text>
                        {/* <Text style={styles.duration}>{secondsToMin(media.duration)}</Text> */}
                    </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <IconButton icon={media.isDone ? 'check-circle' : 'check-circle-outline'} size={22} onPress={onPressDone} color='green' style={{ paddingTop: 10 }} />
                    <SummaryMenu media={media} open={() => setIsMenuVisible(true)} close={() => setIsMenuVisible(false)} isVisible={isMenuVisible} />
                </View>
            </View>
        </TouchableOpacity >
    );
};

type SummaryMenuProps = {
    open: () => void,
    close: () => void,
    isVisible: boolean,
    media: MyMedia,
}

const SummaryMenu = ({ media, open, close, isVisible }: SummaryMenuProps) => {
    const navigation = useNavigation()

    const onEdit = () => {
        close()
        navigation.navigate('Playback', { media: media, inEditMode: true })
    }
    const onDelete = () => {
        close()
        Alert.alert(
            'Are you sure?', undefined, [
            { text: 'Cancel', style: 'cancel', onPress: () => { }, },
            { text: 'Delete', onPress: () => dispatch(deleteMedia(media.id)) },
        ], { cancelable: true })
    }
    const dispatch = useDispatch()

    return <>
        <Menu
            visible={isVisible}
            onDismiss={close}
            anchor={<IconButton icon="dots-vertical" onPress={open} color={BLUE_COLOUR}></IconButton>}>
            <Menu.Item icon="pencil-box-outline" onPress={onEdit} title="Edit" />
            <Menu.Item icon="share" onPress={showComingSoon} title="Share" />
            <Menu.Item icon="delete" onPress={onDelete} title="Delete" />
        </Menu>
    </>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomColor: 'grey',
        paddingBottom: 10,
        borderWidth: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
        color: 'white'
    },
    duration: {
        color: 'white',
    },
    playBtn: {
        paddingRight: 20
    },
    image: {
        width: 30,
        height: 30,
    },
    imageContainer: {
        paddingRight: 20,
    }
});

const willsmithImageSource = require('../assets/images/willsmith.png');

function timeDisplay(media: MyMedia): string {
    const time = media.deadline?.date ?? media.creationTime
    return new Date(time).toLocaleString()
}
function titleDisplay(media: MyMedia): string {
    return media.title ||
        'My commitment'
}