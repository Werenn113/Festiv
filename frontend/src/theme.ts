import { createContext, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "./app/reduxConfig/redux-hooks"
import { selectThemeMode, toggleMode } from "./redux/theme/themeSlice"
import { createTheme, Theme } from "@mui/material/styles"
import { PaletteMode } from "@mui/material"

export const tokens = (mode: string) => ({
	...(mode === "dark" ?
		{
			grey: {
				100: "#e0e0e0",
				200: "#c2c2c2",
				300: "#a3a3a3",
				400: "#858585",
				500: "#666666",
				600: "#525252",
				700: "#3d3d3d",
				800: "#292929",
				900: "#141414"
			},
			primary: {
				100: "#d0d1d5",
				200: "#a1a4ab",
				300: "#727681",
				400: "#1F2A40",
				500: "#141b2d",
				600: "#101624",
				700: "#0c101b",
				800: "#080b12",
				900: "#040509",
			},
			green: {
				100: "#dbf5ee",
				200: "#b7ebde",
				300: "#94e2cd",
				400: "#70d8bd",
				500: "#4cceac",
				600: "#3da58a",
				700: "#2e7c67",
				800: "#1e5245",
				900: "#0f2922"
			},
			red: {
				100: "#f8dcdb",
				200: "#f1b9b7",
				300: "#e99592",
				400: "#e2726e",
				500: "#db4f4a",
				600: "#af3f3b",
				700: "#832f2c",
				800: "#58201e",
				900: "#2c100f"
			},
			blue: {
				100: "#e1e2fe",
				200: "#c3c6fd",
				300: "#a4a9fc",
				400: "#868dfb",
				500: "#6870fa",
				600: "#535ac8",
				700: "#3e4396",
				800: "#2a2d64",
				900: "#151632"
			},
			purple: {
				100: "#e3d1f0",
				200: "#cc9fed",
				300: "#a05cd1",
				400: "#823db3",
				500: "#64278f",
				600: "#33124a",
				700: "#360f54",
				800: "#24063b",
				900: "#11021c"
			},
			yellow: {
				100: "#f7f6cc",
				200: "#eeed99",
				300: "#e6e466",
				400: "#dddb33",
				500: "#d5d200",
				600: "#aaa800",
				700: "#807e00",
				800: "#555400",
				900: "#2b2a00"
			},
			darkGreen: {
				100: "#d3d8d2",
				200: "#a7b1a4",
				300: "#7b8977",
				400: "#4f6249",
				500: "#233b1c",
				600: "#1c2f16",
				700: "#152311",
				800: "#0e180b",
				900: "#070c06"
			},
			orange: {
				100: "#fbe1cd",
				200: "#f8c29c",
				300: "#f4a46a",
				400: "#f18539",
				500: "#ed6707",
				600: "#be5206",
				700: "#8e3e04",
				800: "#5f2903",
				900: "#2f1501"
			},
			marineBlue: {
				100: "#ccd6e0",
				200: "#99adc2",
				300: "#6685a3",
				400: "#335c85",
				// 500: "#003366",
				500: "#ccd6e0",
				600: "#002952",
				700: "#001f3d",
				800: "#001429",
				900: "#000a14"
			},
			neutral: {
				100: "#d6d7da",
				200: "#adb0b6",
				300: "#848891",
				400: "#5b616d",
				500: "#323948",
				600: "#282e3a",
				700: "#1e222b",
				800: "#14171d",
				900: "#0a0b0e"
			},
			indigo: {
				100: "#dbe5e9",
				200: "#b7cad2",
				300: "#93b0bc",
				400: "#6f95a5",
				500: "#4b7b8f",
				600: "#3c6272",
				700: "#2d4a56",
				800: "#1e3139",
				900: "#0f191d"
			},
			turquoise: {
				100: "#d9e9e5",
				200: "#b3d2cc",
				300: "#8dbcb2",
				400: "#67a599",
				500: "#418f7f",
				600: "#347266",
				700: "#27564c",
				800: "#1a3933",
				900: "#0d1d19"
			},
		} : {/*light mode*/
			grey: {
				100: "#141414",
				200: "#292929",
				300: "#3d3d3d",
				400: "#525252",
				500: "#666666",
				600: "#858585",
				700: "#a3a3a3",
				800: "#c2c2c2",
				900: "#e0e0e0",
			},
			primary: {
				100: "#040509",
				200: "#080b12",
				300: "#0c101b",
				400: "#FFFFFF",
				500: "#f2f0f0",
				600: "#dee0e3",
				700: "#ededed",
				800: "#f2f2f5",
				900: "#f5f5f7",
			},
			green: {
				100: "#0f2922", // darker
				200: "#1e5245",
				300: "#2e7c67",
				400: "#3da58a",
				500: "#089c76",
				600: "#0abf91",
				700: "#94e2cd",
				800: "#b7ebde",
				900: "#dbf5ee", // lighter
			},
			red: {
				100: "#2c100f",
				200: "#58201e",
				300: "#832f2c",
				400: "#af3f3b",
				500: "#db4f4a",
				600: "#e2726e",
				700: "#e99592",
				800: "#f1b9b7",
				900: "#f8dcdb",
			},
			blue: {
				100: "#151632",
				200: "#2a2d64",
				300: "#3e4396",
				400: "#535ac8",
				500: "#6870fa",
				600: "#868dfb",
				700: "#a4a9fc",
				800: "#c3c6fd",
				900: "#e1e2fe",
			},
			purple: {
				100: "#11021c",
				200: "#24063b",
				300: "#360f54",
				400: "#33124a",
				500: "#64278f",
				600: "#823db3",
				700: "#a05cd1",
				800: "#cc9fed",
				900: "#e3d1f0",
			},
			yellow: {
				100: "#2b2a00",
				200: "#555400",
				300: "#807e00",
				400: "#aaa800",
				500: "#d5d200",
				600: "#dddb33",
				700: "#e6e466",
				800: "#eeed99",
				900: "#f7f6cc",
			},
			darkGreen: {
				100: "#070c06",
				200: "#0e180b",
				300: "#152311",
				400: "#1c2f16",
				500: "#233b1c",
				600: "#4f6249",
				700: "#7b8977",
				800: "#a7b1a4",
				900: "#d3d8d2",
			},
			orange: {
				100: "#2f1501",
				200: "#5f2903",
				300: "#8e3e04",
				400: "#be5206",
				500: "#ed6707",
				600: "#f18539",
				700: "#f4a46a",
				800: "#f8c29c",
				900: "#fbe1cd",
			},
			marineBlue: {
				100: "#000a14",
				200: "#001429",
				300: "#001f3d",
				400: "#002952",
				500: "#003366",
				600: "#335c85",
				700: "#6685a3",
				800: "#99adc2",
				900: "#ccd6e0",
			},
			neutral: {
				100: "#0a0b0e",
				200: "#14171d",
				300: "#1e222b",
				400: "#282e3a",
				500: "#E9E8E8",
				600: "#5b616d",
				700: "#848891",
				800: "#adb0b6",
				900: "#d6d7da",
			},
			indigo: {
				100: "#0f191d",
				200: "#1e3139",
				300: "#2d4a56",
				400: "#3c6272",
				500: "#4b7b8f",
				600: "#6f95a5",
				700: "#93b0bc",
				800: "#b7cad2",
				900: "#dbe5e9",
			},
			turquoise: {
				100: "#0d1d19",
				200: "#1a3933",
				300: "#27564c",
				400: "#347266",
				500: "#418f7f",
				600: "#67a599",
				700: "#8dbcb2",
				800: "#b3d2cc",
				900: "#d9e9e5",
			},
		}
	)
})

// mui them settings
export const themeSettings = (mode: string) => {
	const colors = tokens(mode)

	return {
		palette: {
			mode: mode as PaletteMode,
			...(mode === 'dark' ?
				{
					primary: {
						main: colors.primary[500],
					},
					secondary: {
						main: colors.green[500],
					},
					neutral: {
						dark: colors.grey[700],
						main: colors.grey[500],
						light: colors.grey[100]
					},
					background: {
						default: colors.primary[500],
					}
				} : {
					primary: {
						main: colors.primary[100],
					},
					secondary: {
						main: colors.green[500],
					},
					neutral: {
						dark: colors.grey[700],
						main: colors.grey[500],
						light: colors.grey[100]
					},
					background: {
						default: "#F8F7F7",
					}
				})
		},
		typography: {
			fontFamily: ["Work sans", "sans-serif"].join(","),
			fontSize: 13,
			h1: {
				fontFamily: ["Work sans", "sans-serif"].join(","),
				fontSize: 35,
			},
			h2: {
				fontFamily: ["Work sans", "sans-serif"].join(","),
				fontSize: 28,
			},
			h3: {
				fontFamily: ["Work sans", "sans-serif"].join(","),
				fontSize: 25,
			},
			h4: {
				fontFamily: ["Work sans", "sans-serif"].join(","),
				fontSize: 23,
			},
			h5: {
				fontFamily: ["Work sans", "sans-serif"].join(","),
				fontSize: 20,
			},
			h6: {
				fontFamily: ["Work sans", "sans-serif"].join(","),
				fontSize: 18,
			},
		}
	}
}

// context for color mode
export const ColorModeContext = createContext({
	toggleColorMode: () => {

	}
})

// type for colorMode
export interface ColorMode {
	toggleColorMode: () => void
}

export type ThemeColorModeTuple = [Theme, ColorMode]

export const useMode = (): ThemeColorModeTuple => {

	// const [mode, setMode] = useState<string>("dark")
	const mode = useAppSelector(selectThemeMode)
	const dispatch = useAppDispatch()

	const colorMode = useMemo(
		() => ({
			toggleColorMode: () => {
				dispatch(toggleMode())
			},
		}),
		[dispatch]
	)

	const theme: Theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

	return [theme, colorMode]
}