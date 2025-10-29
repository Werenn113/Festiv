import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function BottomBar() {
    const [value, setValue] = useState(0);
    const navigate = useNavigate()

    useEffect(() => {
        switch(value) {
            case 0:
                navigate('/login')
                break
            case 1:
                navigate('/Register')
                break
            case 2:
                navigate('/Admin')
                break
        }
    }, [value])

    return (
        <Box sx={{ width: 500 }}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(_event, newValue) => {setValue(newValue)}}
            >
                <BottomNavigationAction label="Login" />
                <BottomNavigationAction label="Register" />
                <BottomNavigationAction label="Admin" />
            </BottomNavigation>
        </Box>
    );
}
