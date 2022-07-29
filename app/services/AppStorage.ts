import { VIDEO_STORE_KEY } from "../constants"
import { MyMedia } from "../types"
import { getJson, storeJson } from "./nativeStorage"

export const AppStorage = {

	saveVideo: async (item: MyMedia) => {
		const saved = await getJson(VIDEO_STORE_KEY)
		const newList = saved === null ? [item] : [item, ...saved]
		await storeJson(VIDEO_STORE_KEY, newList)
	},
	getVideos: async () => {
		const saved = await getJson(VIDEO_STORE_KEY)
		return saved === null ? [] : saved
	},
	deleteVideo: async (id: string) => {
		const saved = await getJson(VIDEO_STORE_KEY)
		const itemIndex = saved.findIndex(({ id: savedId }: { id: string }) => savedId === id)

		if (itemIndex === -1) {
			console.error(`Something went wrong, tried to delete but not found in device storage (id=${id}, saved=${saved})`)
		} else {
			saved.splice(itemIndex, 1)
		}
		await AppStorage.saveVideos(saved)
		return await AppStorage.getVideos()
	},
	saveVideos: async (items: {}[]) => {
		await storeJson(VIDEO_STORE_KEY, items)
	}
}