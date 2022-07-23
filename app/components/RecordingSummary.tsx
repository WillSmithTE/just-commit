import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { GetVideoHeading, MyVideo } from '../types';
import { secondsToMin } from '../services/timeUtil';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

export const RecordingSummary = ({ media, }: { media: MyVideo }) => {
    console.log({ media })
    const [moreOptionsModal, setMoreOptionsModal] = useState(false);
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
        <TouchableOpacity onPress={() => navigation.navigate('Playback', { video: media })} >
            <View style={styles.container} >
                <View style={styles.imageContainer}>
                    <Image source={willsmithImageSource} style={styles.image} />
                </View>
                <View>
                    <Text style={styles.title}>
                        {GetVideoHeading(media)}
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.duration}>{media.notificationDate}</Text>
                    <Text style={styles.duration}>{secondsToMin(media.duration)}</Text>
                    {/* <DeleteButton song={song} /> */}
                </View>
            </View>
        </TouchableOpacity >
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

