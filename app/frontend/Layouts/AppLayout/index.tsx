import React from 'react'
import {
	AppShell,
	Navbar,
	Header,
	Footer,
	useMantineTheme,
	Flex,
	Box,
} from '@mantine/core'
import useAppLayoutStyles from './useAppLayoutStyles'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'
import AppFooter from './AppFooter'
import cx from 'clsx'
import useLayoutStore from '../store/LayoutStore'
import MobileMenuToggle from './MobileMenuToggle'

const AppLayout = ({ children }: { children: any }) => {
	const theme = useMantineTheme()
	const { sidebarOpen, sidebarBreakpoint } = useLayoutStore()

	const { classes } = useAppLayoutStyles()

	return (
		<AppShell
			styles={ {
				main: {
					background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
				},
			} }
			navbarOffsetBreakpoint={ sidebarBreakpoint }
			asideOffsetBreakpoint={ sidebarBreakpoint }
			layout="alt"
			header={
				<Header height={ { base: 50 } } px="md">
					<Flex align="center" sx={ { height: '100%' } }>
						<MobileMenuToggle />
						<AppHeader />
					</Flex>
				</Header>
			}
			navbar={
				<Navbar
					className={ cx(classes.navbar) }
					hiddenBreakpoint={ sidebarBreakpoint }
					hidden={ !sidebarOpen }
					width={ { sm: 200, lg: 300 } }
					p="sm"
					sx={ {
						overflow: 'hidden'
					} }
				>
					<AppSidebar />
				</Navbar>
			}
			footer={
				<Footer height={ 36 } px={ 8 } py={ 4 }>
					<AppFooter />
				</Footer>
			}
		>
			<Box>{ children }</Box>
		</AppShell>
	)
}

export default AppLayout
