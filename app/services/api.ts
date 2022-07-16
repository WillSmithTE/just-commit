import { MyVideo } from "../types"
import { AppStorage } from "./AppStorage"
import * as MediaLibrary from 'expo-media-library';

export const api = {
    getRecordings: async function (): Promise<MyVideo[]> {
        console.debug(`getRecordings`)
        try {
            const songs = await AppStorage.getVideos()
            return songs
        } catch (e: any) {
            console.error(`error in getRecordings - ${e.message}`)
            return Promise.reject(e)
        }
    },
    saveVideo: async function ({ video }: { video: MyVideo }): Promise<MyVideo> {
        console.debug(`saveVideo (id=${video.id})`)
        try {
            await AppStorage.saveVideo(video)
            console.debug(`saved video (id=${video.id})`)
            return Promise.resolve(video)
        } catch (e: any) {
            console.error(`error in saveVideo - ${e.message}`)
            return Promise.reject(e)
        }
    },
    deleteVideo: async function (video: MyVideo): Promise<void> {
        await MediaLibrary.deleteAssetsAsync(video)
        await AppStorage.deleteVideo(video.id)
        console.debug(`deleted song (id=${video.id})`)
    }
}

