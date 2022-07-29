import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { showError } from '../components/Error'
import { MyMedia } from '../types'
import { api } from './api'

export interface MediaState {
    medias: MyMedia[] | undefined
}

const initialState: MediaState = {
    medias: undefined,
}

type MediaDonePayload = {
    id: string,
    done: boolean,
}

export const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        upsertMedia: (state, action: PayloadAction<MyMedia>) => {
            console.debug(`upserting (${JSON.stringify({ new: action.payload, current: state.medias }, null, 2)})`)
            if (state.medias) {
                const index = state?.medias?.findIndex(({ id }) => action.payload.id === id)
                if (index === -1) {
                    state.medias = [action.payload].concat(state.medias)
                } else {
                    state.medias[index] = action.payload
                }
            } else {
                state.medias = [action.payload]
            }
        },
        deleteMedia: (state, action: PayloadAction<string>) => {
            if (state?.medias === undefined) {
                console.error(`tried to delete but medias was undefined`)
                return
            }
            const index = state.medias.findIndex(({ id }) => action.payload === id)
            if (index === -1) {
                console.error(`couldn't find song to delete (id=${action.payload})`)
            } else {
                state.medias!!.splice(index, 1)
            }
        },
        setMediaDone: (state, action: PayloadAction<MediaDonePayload>) => {
            console.debug(`setting media done (id=${action.payload.id}, done=${action.payload.done})`)
            const index = state?.medias?.findIndex(({ id }) => action.payload.id === id)
            if (index === -1 || index === undefined) {
                showError(`can't mark done, media not found (id=${action.payload})`)
            } else {
                state.medias!![index].isDone = action.payload.done
            }
        },
    },
})

export const { upsertMedia, deleteMedia, setMediaDone } = mediaSlice.actions

export const mediaReducer = mediaSlice.reducer
