import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { MyMedia } from '../types';
import { secondsToMin } from '../services/timeUtil';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { Button, Divider, IconButton, Menu } from 'react-native-paper';
import { BLUE_COLOUR } from '../constants';
import { useDispatch } from 'react-redux';
import { deleteMedia, setMediaAsDone } from '../services/mediaSlice';
import { showMessage, hideMessage } from "react-native-flash-message";

export const RecordingSummary = ({ media, }: { media: MyMedia }) => {
    const [isMenuVisible, setIsMenuVisible] = React.useState(false);

    const [sound, setSound] = React.useState<Audio.Sound | undefined>();
    const [isPlaying, setIsPlaying] = React.useState(false);
    const navigation = useNavigation();

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
                        <Text style={styles.duration}>{secondsToMin(media.duration)}</Text>
                    </View>
                </View>
                <View>
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

const comingSoon = () => { showMessage({ message: 'Coming soon!', type: 'success' }) }

const SummaryMenu = ({ media, open, close, isVisible }: SummaryMenuProps) => {
    const navigation = useNavigation()

    const onEdit = () => {
        close()
        navigation.navigate('Playback', { media: media, inEditMode: true })
    }
    const onDone = () => {
        dispatch(setMediaAsDone(media.id))
        showMessage({ message: `Done! You're a star ✨`, type: 'success' })
    }
    const dispatch = useDispatch()

    return <>
        <Menu
            visible={isVisible}
            onDismiss={close}
            anchor={<IconButton icon="dots-vertical" onPress={open} color={BLUE_COLOUR}></IconButton>}>
            <Menu.Item icon="check" onPress={onDone} title="Done" />
            <Menu.Item icon="pencil-box-outline" onPress={onEdit} title="Edit" />
            <Menu.Item icon="share" onPress={comingSoon} title="Share" />
            <Menu.Item icon="delete" onPress={() => dispatch(deleteMedia(media.id))} title="Delete" />
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
    const time = media.notificationDate ?? media.creationTime
    return new Date(time).toLocaleString()
}
function titleDisplay(media: MyMedia): string {
    return media.title ||
        'My commitment'
}