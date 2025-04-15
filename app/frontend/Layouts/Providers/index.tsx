import React from "react"

import ContrastingColorsSetup from "./ContrastingColorsSetup"
import IconProvider from "./IconProvider"
import QueryProvider from "./QueryProvider"
import UiFrameworkProvider from "./UiFrameworkProvider"

import "./reset.css"
import "@mantine/core/styles.css"
import "@mantine/tiptap/styles.css"
import "@mantine/dates/styles.css"
import "@mantine/notifications/styles.css"
import "mantine-contextmenu/styles.layer.css"
import "./global.css"

// import "react-big-calendar/lib/css/react-big-calendar.css"

interface IProviderProps {
	children?: React.ReactNode
}

const Providers = React.memo(({ children }: IProviderProps) => {
	return (
		<QueryProvider>
			<UiFrameworkProvider>
				<ContrastingColorsSetup />
				<IconProvider>
					{ children }
				</IconProvider>
			</UiFrameworkProvider>
		</QueryProvider>
	)
})

export default Providers
