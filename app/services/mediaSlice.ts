import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MyVideo } from '../types'
import { api } from './api'

export interface MediaState {
    medias: MyVideo[] | undefined
}

const initialState: MediaState = {
    medias: undefined,
}

export const getMediaThunk = createAsyncThunk(
    'media/get',
    async () => {
        console.log(`about to get media in thunk`)
        const response = await api.getRecordings()
        console.log(`getMediaThunk (response=${response})`)
        return response
    }
)

export const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        upsertMedia: (state, action: PayloadAction<MyVideo>) => {
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
            const index = state?.medias?.findIndex(({ id }) => action.payload === id)
            if (index === -1 || !index) {
                console.error(`couldn't find song to delete (id=${action.payload})`)
            } else {
                state.medias!!.splice(index, 1)
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMediaThunk.fulfilled, (state, action) => {
            state.medias = action.payload
        })
    },
})

export const { upsertMedia, deleteMedia } = mediaSlice.actions

export const mediaReducer = mediaSlice.reducer
