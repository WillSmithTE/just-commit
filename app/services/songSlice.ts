import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Song } from '../types'
import { api } from './api'

export interface SongState {
    songs: Song[] | undefined
}

const initialState: SongState = {
    songs: undefined,
}

export const getRecordingsThunk = createAsyncThunk(
    'song/get',
    async () => {
        console.log(`about to get songs in thunk`)
        const response = await api.getRecordings()
        console.log(`getRecordingsThunk (response=${response})`)
        return response
    }
)

export const songSlice = createSlice({
    name: 'song',
    initialState,
    reducers: {
        addSong: (state, action: PayloadAction<Song>) => {
            state.songs = state.songs ? [action.payload].concat(state.songs) : [action.payload]
        },
        deleteSong: (state, action: PayloadAction<string>) => {
            const index = state?.songs?.findIndex(({ id }) => action.payload === id)
            if (index === -1 || !index) {
                console.error(`couldn't find song to delete (id=${action.payload})`)
            } else {
                state.songs!!.splice(index, 1)
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getRecordingsThunk.fulfilled, (state, action) => {
            state.songs = action.payload
        })
    },
})

export const { addSong, deleteSong, } = songSlice.actions

export const songReducer = songSlice.reducer
