import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AtLeast, MyMedia } from '../types'

export interface SelectedMediaState {
    selectedMedia?: AtLeast<MyMedia, 'uri'>
}

const initialState: SelectedMediaState = {

}

export const selectedMediaSlice = createSlice({
    name: 'selected-media',
    initialState,
    reducers: {
        selectMedia: (state, action: PayloadAction<AtLeast<MyMedia, 'uri'>>) => {
            state.selectedMedia = action.payload
            console.log('setting new media')
        },
        clearSelectedMedia: (state, _: PayloadAction<void>) => {
            state.selectedMedia = undefined
        },
    },
})

export const { selectMedia, clearSelectedMedia } = selectedMediaSlice.actions

export const selectedMediaReducer = selectedMediaSlice.reducer
