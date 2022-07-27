import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MyVideo } from '../types'
import { api } from './api'

export interface MediaState {
    medias: MyVideo[] | undefined
}

const initialState: MediaState = {
    medias: undefined,
}

export const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        upsertMedia: (state, action: PayloadAction<MyVideo>) => {
            console.debug(`upserting (${JSON.stringify({ new: action.payload, current: state.medias }, null, 2)})`)
            if (state.medias) {
                console.debug(1)
                const index = state?.medias?.findIndex(({ id }) => action.payload.id === id)
                console.debug({index})
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
    },
})

export const { upsertMedia, deleteMedia } = mediaSlice.actions

export const mediaReducer = mediaSlice.reducer
