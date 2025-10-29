import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserType } from "../../types/users-types"
import { RootState } from "../../app/reduxConfig/store"

interface StateType {
    user : UserType | null
    access_token : string | null
}
const initialState : StateType = {
    user: null,
    access_token: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        setLoggedInUser: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload
        },

        setAccessToken: (state, action: PayloadAction<string | null>) => {
            state.access_token = action.payload
        },

        setIsLoggedOut : (state, action: PayloadAction<boolean>) => {
            if (state.user)
                state.user.isLoggedOut = action.payload
        },

        resetAuthStore: () => {
            return initialState
        },
    },
})

export const {
    setLoggedInUser,
    setAccessToken,
    setIsLoggedOut,
    resetAuthStore,
} = authSlice.actions

export const selectIsLoggedOut = (state: RootState) => 
    state.persistedReducer.auth.user?.isLoggedOut
export const selectAccessToken = (state: RootState) => 
    state.persistedReducer.auth.access_token
export const selectFullUser = (state: RootState) => 
    state.persistedReducer.auth.user

export default authSlice.reducer
