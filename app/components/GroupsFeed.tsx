import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, ImageSourcePropType } from 'react-native';

import { RecordingSummary } from './RecordingSummary';
import { useSelector } from 'react-redux';
import { RootState } from '../services/reduxStore';
import { MyMedia } from '../types';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { Button } from 'react-native-paper';

type GroupsFeedProps = {
    timeUntil?: Date,
    shouldDisplayItem?: (media: MyMedia) => boolean,
}

type Group = { name: string, imageUri: ImageSourcePropType }
const groups: Group[] = [
    {
        name: 'Japanese study',
        imageUri: require('../assets/images/markus-winkler-YNPEJTxcfzY-unsplash.jpg')
    },
    {
        name: 'Berlin morning runners',
        imageUri: require('../assets/images/flo-karr-HyivyCRdz14-unsplash.jpg')
    },
    {
        name: 'Berin Alba',
        imageUri: require('../assets/images/flo-karr-HyivyCRdz14-unsplash.jpg')
    },
    {
        name: 'Trumpet players',
        imageUri: require('../assets/images/flo-karr-HyivyCRdz14-unsplash.jpg')
    },
]

type User = { name: string }
type Post = { group: Group, user: User, mediaUri: string }
const posts: Post[] = [
    {
        group: groups[0],
        user: { name: 'Jamal Muzzi' },
        mediaUri: 'https://im2.ezgif.com/tmp/ezgif-2-e845313322.mp4'
    },
    {
        group: groups[0],
        user: { name: 'Jamal Muzzi' },
        mediaUri: 'https://im2.ezgif.com/tmp/ezgif-2-e845313322.mp4'
    }
]


export const GroupsFeed = ({ shouldDisplayItem }: GroupsFeedProps) => {

    const medias = useSelector((state: RootState) => state.media.medias)
    return (<View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1, }}>
        <ScrollView showsHorizontalScrollIndicator horizontal style={{ flexGrow: 0, paddingTop: 20, }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', }}>
                {groups.map((group, i) => <View style={{ margin: 10, }} key={i}>
                    <Image source={group.imageUri} style={{ height: 80, width: 80, }} />
                    <Text style={{ color: 'white', position: 'absolute', bottom: 0 }}>{group.name}</Text>
                </View>)}
            </View>
        </ScrollView>
        <ScrollView
            style={{ flex: 1, backgroundColor: '#474745', }}
            contentContainerStyle={{
                paddingTop: 20,

            }}
            showsVerticalScrollIndicator
        >
            <View >
                {
                    posts.map((post, i) => (
                        <GroupPost
                            key={i}
                            post={post}
                        />
                    ))
                }
            </View>
        </ScrollView>
    </View>
    );
};

type GroupPostProps = { post: Post }
const GroupPost = ({ post }: GroupPostProps) => {
    const video = React.useRef<Video>(null);
    const [status, setStatus] = React.useState<AVPlaybackStatus | undefined>();

    useEffect(() => {
        console.debug(`status=${JSON.stringify(status, null, 2)}`)
        if (status?.isLoaded && status.didJustFinish) {
            video.current!!.setPositionAsync(0)
            video.current!!.pauseAsync()
        }
    }, [status])

    return <View style={{ flex: 1, margin: 10, backgroundColor: 'black' }}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
            <Image source={post.group.imageUri} style={{ height: 50, width: 50 }} />
            <Text style={{ color: 'white' }}>{post.group.name}</Text>
        </View>
        <View>
            <Video
                ref={video}
                style={styles.video}
                source={{
                    uri: post.mediaUri,
                }}
                useNativeControls={false}
                resizeMode={ResizeMode.CONTAIN}
                isLooping={false}
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View >
                <Button
                    onPress={() =>
                        status?.isLoaded && status?.isPlaying ? video.current!!.pauseAsync() : video.current!!.playAsync()
                    }
                >{status?.isLoaded && status?.isPlaying ? 'Pause' : 'Play'}</Button>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
});
