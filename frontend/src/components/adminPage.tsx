import { Button } from "@mui/material"
import { deleteUser, logout } from "../app/api/usersApi"
import { useState } from "react"
import { store } from "../app/reduxConfig/store"
import { useDispatch } from "react-redux"
import { resetAuthStore } from "../redux/auth/authSlice"
import { UserLocation } from "./map/userLocation"

export function AdminPage() {

    const username =  store.getState().persistedReducer.auth.user?.username

    const dispatch = useDispatch()

    const [, setIsLoading ] = useState(false)

    const handleLogout = () => {
        logout(setIsLoading)
        dispatch(resetAuthStore())
    }

    const handleDeleteUser = () => {
        deleteUser(setIsLoading)
        dispatch(resetAuthStore())
    }

    return (
        <div>
            <p>Admin page </p>
            <p>Welcome {username}</p>
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={handleDeleteUser}>Delete User</Button>
            <UserLocation/>
        </div>
    )
}