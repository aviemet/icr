import React from 'react'
import { useLayoutStore } from '@/lib/store'
import MenuLink from './MenuLink'
import { Routes } from '@/lib'
import { Avatar, Skeleton, Group, AppShell, Box, Flex, Text } from '@/Components'
import ToggleSidebarButton from '../ToggleSidebarButton'
import IconProvider from '@/Layouts/Providers/IconProvider'
import { useLocation, usePageProps } from '@/lib/hooks'

import cx from 'clsx'
import * as classes from '../AppLayout.css'
import { SiteLogo } from '@/Features'
import { TextInput } from '@/Components/Inputs'
import { ClientIcon, EmployeeIcon } from '@/Components/Icons'

const Sidebar = () => {
	const { auth: { user } } = usePageProps()
	const { sidebarOpen, siteTitle } = useLayoutStore()
	const { paths } = useLocation()

	return (
		<IconProvider size="1.2rem">
			<AppShell.Navbar
				p={ 0 }
				hidden={ !sidebarOpen }
				className={ cx(classes.navbar) }
			>
				<Box>
					<Box m="xs">
						<Group justify="flex-end">
							<ToggleSidebarButton />
						</Group>

						<Group>
							<SiteLogo />
							<Flex
								direction="column"
								wrap="nowrap"
							>
								<Box><Text size="xl" fw={ 700 }>{ siteTitle }</Text></Box>
								<Box><Text size="sm">{ user.person.full_name }</Text></Box>
							</Flex>
						</Group>
					</Box>

					<Box p="md">
						<TextInput placeholder="Search" />
					</Box>

					<Box p="md" className={ cx('links', { closed: !sidebarOpen }) }>
						<ul>
							<li>
								<MenuLink
									href={ Routes.clients() }
									icon={ <ClientIcon /> }
									active={ paths.length === 1 && paths[0] === 'clients' }
								>
								Clients
								</MenuLink>
								<ul>
									<li><MenuLink href="/">Schedules</MenuLink></li>
								</ul>
							</li>
							<li><MenuLink href="/" icon={ <EmployeeIcon /> }>Employees</MenuLink></li>
						</ul>
					</Box>
				</Box>

			</AppShell.Navbar>
		</IconProvider>
	)
}

export default Sidebar
