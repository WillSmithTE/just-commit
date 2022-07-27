import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable, Text, Animated } from 'react-native';
import Icon from './Icon';
import { useEffect, useRef, useState } from 'react';
import { Camera, CameraType, VideoCodec } from 'expo-camera';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import * as Device from 'expo-device';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { BLUE_COLOUR } from '../constants';

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

    return <>
        <Pressable onPressIn={start} onPressOut={stop}>
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
            <View style={{ ...circleStyles.circleContainer, paddingTop: isRecording ? 0 : 20 }}>
                {!isRecording && <View style={circleStyles.outerCircle} />}
                <View style={circleStyles.innerCircle} />
            </View>
        </Pressable>
    </>
}

const circleStyles = StyleSheet.create({
    circleContainer: {
        alignSelf: 'center',
    },
    outerCircle: {
        borderRadius: outerCircleSize / 2,
        width: outerCircleSize,
        height: outerCircleSize,
        borderColor: 'white',
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
