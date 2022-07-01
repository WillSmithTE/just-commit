import React, { memo, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'react-query';

import { api } from '../services/api';
import { Song } from '../types';
import { jsonString } from '../util';
import { RecordingSummary } from './RecordingSummary';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../services/reduxStore';
import { getRecordingsThunk } from '../services/songSlice';

export const RecordingsList = () => {

    const songs = useSelector((state: RootState) => state.song.songs)
    const dispatch = useDispatch()
    React.useEffect(() => {
        console.log(`songsInEffect=${jsonString(songs)}`)
        if (!songs) {
            console.log(`in nnegative`)
            dispatch(getRecordingsThunk())
        }
    }, [])

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                paddingTop: 20,
            }}
            showsVerticalScrollIndicator
        >
            {songs?.length === 0 && <Text>Make your first recording to see it here.</Text>}
            {songs?.map((song) => (
                <RecordingSummary
                    key={song.id}
                    song={song}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
