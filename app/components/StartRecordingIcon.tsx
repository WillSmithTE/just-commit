import * as React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useFeature, Feature } from '../hooks/useFeature';

const maxCircleSize = 125
const outerCircleSize = 90
const innerCircleSize = 75

const mode1 = {
    key: 1,
    backgroundColor: "#3d5875",
    tintColor: '#00e0ff'
}
const mode2 = {
    key: 2,
    backgroundColor: "#00e0ff",
    tintColor: '#3d5875'
}

export const StartRecordingIcon = ({ isRecording, start, stop }: { isRecording: boolean, start: () => void, stop: () => void }) => {
    const [mode, setMode] = useState(mode1)
    const isFabInMiddle = useFeature(Feature.RECORD_FAB_IN_MIDDLE)

    return <Pressable onPressIn={start} onPressOut={stop} style={circleStyles(isFabInMiddle).pressable}>
        {isRecording && <AnimatedCircularProgress
            key={new Date().toString()}
            size={maxCircleSize}
            width={20}
            duration={5 * 1000}
            fill={100}
            tintColor={mode.tintColor}
            onAnimationComplete={() => setMode(mode === mode1 ? mode2 : mode1)}
            backgroundColor={mode.backgroundColor}
            style={{ transform: [{ rotate: '270deg' }] }}
        />}
        <View style={{ ...circleStyles(isFabInMiddle).circleContainer, paddingTop: isRecording ? 0 : 20 }}>
            {!isRecording && <View style={circleStyles(isFabInMiddle).outerCircle} />}
            {!isFabInMiddle && <View style={circleStyles(isFabInMiddle).innerCircle} />}
        </View>
    </Pressable>
    {/* </> */ }
}

const circleStyles = (isFabInMiddle: boolean) => StyleSheet.create({
    circleContainer: {
        alignSelf: 'center',
    },
    pressable: {
    },
    outerCircle: {
        borderRadius: outerCircleSize / 2,
        width: outerCircleSize,
        height: outerCircleSize,
        borderColor: isFabInMiddle ? 'transparent' : 'white',
        borderWidth: 3,
        // position: 'absolute',
        bottom: (maxCircleSize - outerCircleSize) / 2,
        alignSelf: 'center',
        elevation: 100,
    },
    innerCircle: {
        elevation: 100,
        borderRadius: innerCircleSize / 2,
        width: innerCircleSize,
        height: innerCircleSize,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: (maxCircleSize - innerCircleSize) / 2,
        alignSelf: 'center',
    }
});
