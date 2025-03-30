import { useMantineTheme } from "@mantine/core"
import { EventObject } from "@toast-ui/calendar"
import { useCallback } from "react"

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
