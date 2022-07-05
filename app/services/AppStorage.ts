import { VIDEO_LIST_KEY } from "../constants"
import { Video } from "../types"
import { getJson, storeJson } from "./nativeStorage"

export const AppStorage = {

	saveVideo: async (item: Video) => {
		const saved = await getJson(VIDEO_LIST_KEY)
		const newList = saved === null ? [item] : [item, ...saved]
		await storeJson(VIDEO_LIST_KEY, newList)
	},
	getVideos: async () => {
		const saved = await getJson(VIDEO_LIST_KEY)
		return saved === null ? [] : saved
	},
	deleteVideo: async (id: string) => {
		const saved = await getJson(VIDEO_LIST_KEY)
		const itemIndex = saved.findIndex(({ id: savedId }: { id: string }) => savedId === id)

		if (itemIndex === -1) {
			console.error(`Something went wrong, tried to delete but not found in device storage (id=${id}, saved=${saved})`)
		} else {
			saved.splice(itemIndex, 1)
		}
		await AppStorage.saveVideos(saved)
	},
	saveVideos: async (items: {}[]) => {
		await storeJson(VIDEO_LIST_KEY, items)
	}
}