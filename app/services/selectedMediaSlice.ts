import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AtLeast, MyVideo } from '../types'

export interface SelectedMediaState {
    selectedMedia?: AtLeast<MyVideo, 'uri'>
}

const initialState: SelectedMediaState = {

}

export const selectedMediaSlice = createSlice({
    name: 'selected-media',
    initialState,
    reducers: {
        selectMedia: (state, action: PayloadAction<AtLeast<MyVideo, 'uri'>>) => {
            state.selectedMedia = action.payload
        },
        clearSelectedMedia: (state, _: PayloadAction<void>) => {
            state.selectedMedia = undefined
        },
    },
})

export const { selectMedia, clearSelectedMedia } = selectedMediaSlice.actions

export const selectedMediaReducer = selectedMediaSlice.reducer
