import { Burger, MediaQuery, useMantineTheme } from '@mantine/core'
import React from 'react'
import useLayoutStore from '../store/LayoutStore'

const MobileMenuToggle = () => {
	const theme = useMantineTheme()
	const { sidebarOpen, sidebarBreakpoint, toggleSidebarOpen } = useLayoutStore()

	return (
		<MediaQuery largerThan={ sidebarBreakpoint } styles={ { display: 'none' } }>
			<Burger
				opened={ sidebarOpen }
				onClick={ () => toggleSidebarOpen() }
				size="sm"
				color={ theme.colors.gray[6] }
				mr="xl"
			/>
		</MediaQuery>
	)
}

export default MobileMenuToggle
