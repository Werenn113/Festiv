import { Button } from "@mui/material";
import TextFields from "./forms/textInput";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../app/api/usersApi";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../redux/auth/authSlice";


export function LoginPage() {
    const [email, setEmail] = useState("john@example.com")
    const [password, setPassword] = useState("123456")

    const [, setIsLoading ] = useState(false)

    const navigate = useNavigate()

    const dispatch = useDispatch()
    
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await login(setIsLoading, {email, password})
            if (response?.status === 200) {
                dispatch(setLoggedInUser(response.data))
            }
            navigate('/admin')
        } catch (error) {
            console.error('Login failed', error)
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <TextFields value={email} onChange={setEmail} label="Email"/>
            <TextFields value={password} onChange={setPassword} label="Password"/>
            <Button type="submit">Login</Button>
        </form>
    )
}