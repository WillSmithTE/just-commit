import React, { } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { RecordingSummary } from './RecordingSummary';
import { useSelector } from 'react-redux';
import { RootState } from '../services/reduxStore';
import { MyMedia } from '../types';

type RecordingsListProps = {
    timeUntil?: Date,
    shouldDisplayItem?: (media: MyMedia) => boolean,
}

export const RecordingsList = ({ shouldDisplayItem }: RecordingsListProps) => {

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
                <Text style={{ color: 'white' }}>Record something to see it here.</Text>
                :
                (shouldDisplayItem ? medias.filter(shouldDisplayItem) : medias)
                    .map((media) => (
                        <RecordingSummary
                            key={`${media.type}-${media.id}`}
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
