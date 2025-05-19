import React from "react"

import ContrastingColorsSetup from "./ContrastingColorsSetup"
import IconProvider from "./IconProvider"
import QueryProvider from "./QueryProvider"
import UiFrameworkProvider from "./UiFrameworkProvider"

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
