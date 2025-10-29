// redux/theme/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/reduxConfig/store';


const initialState = {
    mode: 'light', // default mode
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleMode: (state) => {
            state.mode = state.mode === 'light' ? 'dark' : 'light';
        },
        setMode: (state, action) => {
            state.mode = action.payload;
        },
    },
});

export const { toggleMode, setMode } = themeSlice.actions;
export const selectThemeMode = (state : RootState) => state.persistedReducer.theme.mode;
export default themeSlice.reducer;