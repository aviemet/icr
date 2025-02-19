import { useCallback } from "react"
import { useMantineTheme } from "@mantine/core"
import { EventObject } from "@toast-ui/calendar"

const useDefaultEventOptions = () => {
	const theme = useMantineTheme()

	const defaultEventOptions = useCallback((options: EventObject): EventObject => ({
		color: "inherit",
		backgroundColor: theme.colors.body,
		dragBackgroundColor: theme.colors.gray[6],
		borderColor: "inherit",
		...options,
	}), [theme])

	return defaultEventOptions
}

export default useDefaultEventOptions
