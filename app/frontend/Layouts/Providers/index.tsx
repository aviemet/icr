import React from 'react'
import IconProvider from './IconProvider'
import UiFrameworkProvider from './UiFrameworkProvider'

import './reset.css'
import '@mantine/core/styles.css'
import '@mantine/tiptap/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import './global.css'
import QueryProvider from './QueryProvider'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import ContrastingColorsSetup from './ContrastingColorsSetup'

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
