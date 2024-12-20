import useStore from '@/lib/store'
import { useComputedColorScheme, useMantineTheme } from '@mantine/core'
import React from 'react'

const ContrastingColorsSetup = () => {
	const theme = useMantineTheme()
	const colorScheme = useComputedColorScheme()
	const setThemeData = useStore((state) => state.setThemeData)

	React.useEffect(() => {
		setThemeData(theme, colorScheme)
	}, [theme, colorScheme, setThemeData])

	return <></>
}

export default ContrastingColorsSetup
