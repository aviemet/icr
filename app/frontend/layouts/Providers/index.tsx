import React from "react"

import { ContrastingColorsSetup } from "./ContrastingColorsSetup"
import { IconProvider } from "./IconProvider"
import { QueryProvider } from "./QueryProvider"
import { UiFrameworkProvider } from "./UiFrameworkProvider"

export interface ProvidersProps {
	children?: React.ReactNode
}

export const Providers = React.memo(({ children }: ProvidersProps) => {
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
