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
    media: AtLeast<MyMedia, 'uri'>,
    inEditMode?: boolean,
  };
  Settings: undefined
  RecordFullscreen: undefined
  SaveEditFullScreen: undefined
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  Library: undefined;
  Home: undefined;
  Record: undefined;
  Groups: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MyMedia = MediaLibrary.Asset & {
  title?: string,
  deadline?: MyNotification,
  reminders?: MyNotification[],
  isNotificationAcknowledged?: boolean,
  type: 'audio' | 'video',
  isDone?: boolean,
  repeat?: Repeat
}

type MyNotification = {
  date: number,
  id: string,
}

type Repeat = {
  label: string,
}

export function isMyVideo(video: AtLeast<MyMedia, 'uri'>): video is MyMedia {
  console.debug(JSON.stringify(video, null, 2))
  return isMediaLibAsset(video)
}

const mediaLibAssetProps = ['id', 'duration', 'modificationTime', 'creationTime', 'height', 'width', 'mediaType', 'uri', 'filename']

function isMediaLibAsset(asset: { [prop: string]: any }): asset is MediaLibrary.Asset {
  return mediaLibAssetProps
    .every((assetProp) => {
      return asset[assetProp] !== undefined
    })
}


export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>
export type AtLeast2<T, K extends keyof T, J extends keyof T> = Partial<T> & Pick<T, K> & Pick<T, J>

