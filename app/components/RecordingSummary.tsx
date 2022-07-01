import React, { useEffect, useState, memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from './Icon';
import { DeleteButton } from './DeleteButton';
import { Song } from '../types';
import millisToMin from '../services/millisToMin';
import { ORANGE_COLOUR } from '../constants';
import { Audio } from 'expo-av';

export const RecordingSummary = ({
    song,
}: { song: Song }) => {
    const [moreOptionsModal, setMoreOptionsModal] = useState(false);
    const [sound, setSound] = React.useState<Audio.Sound | undefined>();
    const [isPlaying, setIsPlaying] = React.useState(false);

    async function playOrPause() {
        if (isPlaying) {
            console.log('pausing Sound');
            await sound?.pauseAsync
        } else if (sound) {
            console.log('resuming sound')
            await sound?.playAsync()
        } else {
            console.log('Loading Sound');
            const { sound } = await Audio.Sound.createAsync(
                { uri: song.uri!! },
                {},
                (status) => {if (status.didJustFinish) { finish()}}
                );
            setSound(sound);
            console.log('Playing Sound');
            await sound.playAsync();
            setIsPlaying(true)
        }
    }

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
        <>
            <View style={styles.container} >
                <View >
                    <View>
                        <Text style={styles.title}>
                            {song.title}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.duration}>{millisToMin(song.durationMillis)}</Text>
                        {/* <DeleteButton song={song} /> */}
                    </View>
                </View>
                <View style={styles.playBtn}>
                    <TouchableOpacity onPress={playOrPause}>
                        <Icon family='AntDesign' name={isPlaying ? 'pausecircle' : "play"} color={ORANGE_COLOUR} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
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
