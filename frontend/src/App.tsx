import { CssBaseline, ThemeProvider } from "@mui/material"
import { createBrowserRouter, Outlet, RouterProvider, useNavigate } from "react-router-dom"
import BottomBar from "./components/bottomBar"
import "./App.css"
import { LoginPage } from "./components/loginPage"
import { AdminPage } from "./components/adminPage"
import RequireAuth from "./services/requireAuth"
import { RegisterPage } from "./components/registerPage"
import { ColorModeContext, useMode } from "./theme"
import OurToast from "./components/toasts/Btoast"
import { useEffect } from "react"
import { useAppDispatch } from "./app/reduxConfig/redux-hooks"
import { initializeAxios } from "./app/axiosConfig/axiosConfig"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'login',
        element: <LoginPage />
      },
      {
        path: 'register',
        element: <RegisterPage />
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: 'admin',
            element: <AdminPage />
          }
        ]
      }
    ]
  }
])

function Root() {
  const [theme, colorMode] = useMode()

  /** To allow the use of dispatch & navigate in Axios config */
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    initializeAxios(dispatch, navigate)
  }, [dispatch, navigate])

  return <>
    <ColorModeContext.Provider value={colorMode}>
      <OurToast />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <Outlet />
        </main>
        <footer>
          <BottomBar />
        </footer>
      </ThemeProvider>
    </ColorModeContext.Provider>
  </>
}

function App() {
  return <RouterProvider router={router} />
}

export default App
