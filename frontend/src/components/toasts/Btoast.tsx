import './Btoast.css'
import { toast, Toaster, ToastBar } from 'react-hot-toast'
import { tokens } from '../../theme'
import { IconButton, useTheme } from '@mui/material'

const OurToast = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    return (
        <Toaster
            position="top-center"
            toastOptions={{
                className: 'toast-with-style',
                error: {
                    duration: 6000,
                    style: {
                        border: `1px solid ${colors.red[500]}`,
                        padding: '16px',
                        color: colors.red[500],
                    },
                    iconTheme: {
                        primary: colors.red[500],
                        secondary: '#FFFAEE',
                    },
                },
            }}
        >
            {(t) => (
                <ToastBar toast={t}>
                    {({ icon, message }) => (
                        <>
                            {icon}
                            {message}
                            {t.type !== 'loading' && (
                                <IconButton
                                    aria-label="close"
                                    onClick={() => toast.dismiss(t.id)}
                                    sx={{
                                        color: colors.red[500]
                                    }}
                                >
                                    {/* <CloseIcon /> */}
                                </IconButton>
                                // <button onClick={() => toast.dismiss(t.id)}><CloseIcon/></button>
                            )}
                        </>
                    )}
                </ToastBar>
            )}

        </Toaster >
    )
}

export default OurToast