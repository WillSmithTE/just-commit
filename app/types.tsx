/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as MediaLibrary from 'expo-media-library'

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  NotFound: undefined;
  Playback: {
    video: AtLeast<MyVideo, 'uri'>,
    inEditMode?: boolean,
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Library: undefined;
  Home: undefined;
  Record: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MyVideo = MediaLibrary.Asset & {
  title?: string,
  notificationDate?: number,
  notificationId?: string,
  isNotificationAcknowledged?: boolean,
}

export function isMyVideo(video: AtLeast<MyVideo, 'uri'>): video is MyVideo {
  return isMediaLibAsset(video)
}

function isMediaLibAsset(asset: { [prop: string]: any }): asset is MediaLibrary.Asset {
  ['id', 'duration', 'modificationTime', 'creationTime', 'height', 'width', 'mediaType', 'uri', 'filename']
    .forEach((assetProp) => { if (asset[assetProp] === undefined) return false })
  return true
}


export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
