import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

interface TextInputProps {
    label: string
    value: string
    onChange: (value: string) => void
}

export default function TextInput({ label, value, onChange }: TextInputProps) {
    return (
        <Box
            sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        >
            <TextField
                id="outlined-basic"
                label={label}
                variant="outlined"
                value={value}
                onChange={(e) => onChange(e.target.value)}/>
        </Box>
    );
}
