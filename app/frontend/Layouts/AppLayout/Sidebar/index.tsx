import React from 'react'
import { useLayoutStore } from '@/lib/store'
import MenuLink from './MenuLink'
import { Routes } from '@/lib'
import { Group, AppShell, Box, Flex, Text } from '@/Components'
import ToggleSidebarButton from '../ToggleSidebarButton'
import IconProvider from '@/Layouts/Providers/IconProvider'
import { useLocation, usePageProps } from '@/lib/hooks'

import cx from 'clsx'
import * as classes from '../AppLayout.css'
import { SiteLogo } from '@/Features'
import { TextInput } from '@/Components/Inputs'
import { ClientIcon, EmployeeIcon, SettingsIcon } from '@/Components/Icons'

const Sidebar = () => {
	const { auth: { user } } = usePageProps()
	const { sidebarOpen, siteTitle } = useLayoutStore()
	const { paths } = useLocation()

	return (
		<IconProvider size="1.2rem">
			<AppShell.Navbar
				p={ 0 }
				hidden={ !sidebarOpen }
				className={ cx(classes.navbar, { closed: !sidebarOpen }) }
			>
				<AppShell.Section p="xs">
					<Group justify="flex-end">
						<ToggleSidebarButton />
					</Group>

					<Group>
						<SiteLogo />
						<Flex
							direction="column"
							wrap="nowrap"
							className={ cx('hidden-when-closed') }
						>
							<Box><Text size="xl" fw={ 700 }>{ siteTitle }</Text></Box>
							<Box><Text size="sm">{ user.person.name }</Text></Box>
						</Flex>
					</Group>
				</AppShell.Section>

				<AppShell.Section p="xs" className={ cx('hidden-when-closed') }>
					<TextInput placeholder="Search" />
				</AppShell.Section>

				<AppShell.Section p="xs" grow className={ cx('links') }>
					<ul>
						<li>
							<MenuLink
								href={ Routes.clients() }
								icon={ <ClientIcon /> }
								active={ paths.length === 1 && paths[0] === 'clients' }
							>
								Clients
							</MenuLink>
							{ /* <ul>
								<li><MenuLink href="/">Schedules</MenuLink></li>
							</ul> */ }
						</li>
						<li>
							<MenuLink
								href={ Routes.employees() }
								icon={ <EmployeeIcon /> }
							>
								Employees
							</MenuLink>
						</li>
					</ul>
				</AppShell.Section>

				<AppShell.Section p="xs">
					<MenuLink href={ Routes.settings() } icon={ <SettingsIcon /> }>Settings</MenuLink>
				</AppShell.Section>

			</AppShell.Navbar>
		</IconProvider>
	)
}

export default Sidebar
