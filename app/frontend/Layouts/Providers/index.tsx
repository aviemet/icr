import React from 'react'
import IconProvider from './IconProvider'
import UiFrameworkProvider from './UiFrameworkProvider'
import Spotlight from './Spotlight'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import './reset.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/spotlight/styles.css'
import './global.css'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

interface IProviderProps {
	children?: React.ReactNode
}

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30000,
			cacheTime: 30000,
		},
	},
})

const Providers = React.memo(({ children }: IProviderProps) => {
	return (
		<QueryClientProvider client={ queryClient }>
			{ process.env.NODE_ENV && process.env.NODE_ENV === 'development' && <ReactQueryDevtools position="bottom-right" /> }
			<UiFrameworkProvider>
				<Spotlight />
				<IconProvider>
					{ children }
				</IconProvider>
			</UiFrameworkProvider>
		</QueryClientProvider>
	)
})

export default Providers
