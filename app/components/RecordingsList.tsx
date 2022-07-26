import React, { } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { RecordingSummary } from './RecordingSummary';
import { useSelector } from 'react-redux';
import { RootState } from '../services/reduxStore';

type RecordingsListProps = {
    timeUntil?: Date,
}

export const RecordingsList = ({ timeUntil }: RecordingsListProps) => {

    const medias = useSelector((state: RootState) => state.media.medias)
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{
                paddingTop: 20,
            }}
            showsVerticalScrollIndicator
        >
            {medias === undefined || medias.length === 0 ?
                    <Text style={{color: 'white'}}>Make your first video to see it here.</Text>
                :
                medias.map((media) => (
                    <RecordingSummary
                        key={media.id}
                        media={media}
                    />
                ))
            }
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
