import { Video } from "../types"
import { ENV_VARS } from '../variables'
import { jsonString } from "../util"
import { AppStorage } from "./AppStorage"
import uuid from 'react-native-uuid'
import * as FileSystem from 'expo-file-system'
import moment from 'moment'

export const api = {
    getRecordings: async function (): Promise<Video[]> {
        console.debug(`getRecordings`)
        try {
            const songs = await AppStorage.getVideos()
            return songs
        } catch (e: any) {
            console.error(`error in getRecordings - ${e.message}`)
            return Promise.reject(e)
        }
    },
    saveSong: async function ({uri, durationSeconds}: {uri: string, durationSeconds: number}): Promise<Video> {
        console.log(`time=${new Date().toLocaleDateString(undefined, {day: 'numeric', month: 'short', year: '2-digit', hour: 'numeric', minute: '2-digit'})}`)
        console.debug(`saveSong (uri=${uri})`)
        const song: Video = {
            id: uuid.v4() as string,
            uri,
            durationMillis: durationSeconds * 1000,
            author: 'Me',
            image: '/assets/images/sesame/1.png',
            title: moment().format('d MMM YY, H:mm')
        }
        try {
            await AppStorage.saveVideo(song)
            console.debug(`saved song (id=${song.id})`)
            return Promise.resolve(song)
        } catch (e: any) {
            console.error(`error in getRecordings - ${e.message}`)
            return Promise.reject(e)
        }
    },
    deleteSong: async function (song: Video): Promise<void> {
        await FileSystem.deleteAsync(song.uri!!, { idempotent: true })
        await AppStorage.deleteVideo(song.id)
        console.debug(`deleted song (id=${song.id})`)
    }
}

