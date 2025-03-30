import { useComputedColorScheme, useMantineTheme } from "@mantine/core"
import { useEffect } from "react"

import useStore from "@/lib/store"

const ContrastingColorsSetup = () => {
	const theme = useMantineTheme()
	const colorScheme = useComputedColorScheme()
	const setThemeData = useStore((state) => state.setThemeData)

	useEffect(() => {
		setThemeData(theme, colorScheme)
	}, [theme, colorScheme, setThemeData])

	return <></>
}

export default ContrastingColorsSetup
