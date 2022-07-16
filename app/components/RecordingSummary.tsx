import React, { useEffect, useState, memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from './Icon';
import { GetVideoHeading, MyVideo } from '../types';
import millisToMin from '../services/millisToMin';
import { ORANGE_COLOUR } from '../constants';
import { Audio } from 'expo-av';
import { useDispatch } from 'react-redux';
import { selectMedia } from '../services/selectedMediaSlice';

export const RecordingSummary = ({ media, }: { media: MyVideo }) => {
    const [moreOptionsModal, setMoreOptionsModal] = useState(false);
    const [sound, setSound] = React.useState<Audio.Sound | undefined>();
    const [isPlaying, setIsPlaying] = React.useState(false);
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

    return (
        <TouchableOpacity onPress={() => dispatch(selectMedia(media))}>
            <View style={styles.container} >
                <View >
                    <View>
                        <Text style={styles.title}>
                            {GetVideoHeading(media)}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.duration}>{media.notificationDate}</Text>
                        <Text style={styles.duration}>{millisToMin(media.duration)}</Text>
                        {/* <DeleteButton song={song} /> */}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

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
    }
});
