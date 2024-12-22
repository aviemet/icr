import React from 'react'
import { Burger } from '@/Components'
import useStore from '@/lib/store'
import { useComputedColorScheme } from '@mantine/core'

const ToggleSidebarButton = () => {
	const { sidebarOpen, toggleSidebarOpen } = useStore()
	const colorScheme = useComputedColorScheme()

	return (
		<Burger
			aria-label={ sidebarOpen ?
				'Collapse Navigation'
				:
				'Expand Navigation'
			}
			opened={ sidebarOpen }
			onClick={ () => toggleSidebarOpen() }
			size="sm"
			color={ colorScheme === 'light' ? 'black' : 'white' }
		/>
	)
}

export default ToggleSidebarButton
