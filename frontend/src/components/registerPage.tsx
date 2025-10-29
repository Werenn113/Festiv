import { useState } from "react"
import TextFields from "./forms/textInput";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { register } from "../app/api/usersApi";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../redux/auth/authSlice";


export function RegisterPage() {
    const [ username, setUsername ] = useState("john")
    const [ email, setEmail ] = useState("john@example.com")
    const [ password, setPassword ] = useState("123456")

    const navigate = useNavigate()

    const [, setIsLoading ] = useState(false)

    const dispatch = useDispatch()
    
    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await register(setIsLoading, {username, email, password})
            if (response?.status === 200) {
                dispatch(setLoggedInUser(response.data))
            }
            navigate('/admin')
        } catch (error) {
            console.error('Login failed', error)
        }
    }

    return (
        <form onSubmit={handleRegister}>
            <TextFields value={username} onChange={setUsername} label="Email"/>
            <TextFields value={email} onChange={setEmail} label="Email"/>
            <TextFields value={password} onChange={setPassword} label="Password"/>
            <Button type="submit">Register</Button>
        </form>
    )
}