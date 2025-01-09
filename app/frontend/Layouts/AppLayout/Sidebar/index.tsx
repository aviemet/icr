import { Routes } from '@/lib'
import useStore from '@/lib/store'
import { useLocation, usePageProps } from '@/lib/hooks'
import IconProvider from '@/Layouts/Providers/IconProvider'
import {
	Group,
	AppShell,
	Box,
	Flex,
	Text,
	Link,
	Tooltip,
} from '@/Components'
import { TextInput } from '@/Components/Inputs'
import { ClientIcon, EmployeeIcon, SettingsIcon } from '@/Components/Icons'
import { SiteLogo } from '@/Features'
import ToggleSidebarButton from '../ToggleSidebarButton'
import MenuLink from './MenuLink'

import cx from 'clsx'
import * as classes from '../AppLayout.css'

const Sidebar = () => {
	const { auth: { user } } = usePageProps()
	const { sidebarOpen, siteTitle } = useStore()
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
						<Link href={ Routes.root() }>
							<Tooltip
								label="Home"
								disabled={ sidebarOpen }
								position="right"
								withArrow
							>
								<SiteLogo
									size={ sidebarOpen ? 'md' : 'sm' }
									mt={ sidebarOpen ? 'xxs' : 'md' }
								/>
							</Tooltip>
						</Link>
						<Flex
							direction="column"
							wrap="nowrap"
							className={ cx('hidden-when-closed') }
						>
							<Box><Text size="xl" fw={ 700 }>{ siteTitle }</Text></Box>
							<Box><Text size="sm">{ user?.person?.name }</Text></Box>
						</Flex>
					</Group>
				</AppShell.Section>

				<AppShell.Section p="xs" className={ cx('hidden-when-closed') }>
					<TextInput placeholder="Search" />
				</AppShell.Section>

				<AppShell.Section p="xs" grow className={ cx(classes.navigation) }>
					<MenuLink
						label="Clients"
						href={ Routes.clients() }
						leftSection={ <ClientIcon /> }
						active={ paths.length >= 1 && paths[0] === 'clients' }
					/>
					<MenuLink
						label="Households"
						href="/"
						active={ paths.length >= 1 && paths[0] === 'households' }
					/>
					<MenuLink
						label="Employees"
						href={ Routes.employees() }
						leftSection={ <EmployeeIcon /> }
						active={ paths.length >= 1 && paths[0] === 'employees' }
					/>
				</AppShell.Section>

				<AppShell.Section p="xs">
					<MenuLink
						label="Settings"
						href={ Routes.settings() }
						leftSection={ <SettingsIcon /> }
						active={ paths.length >= 1 && paths[0] === 'settings' }
					/>
				</AppShell.Section>

			</AppShell.Navbar>
		</IconProvider>
	)
}

export default Sidebar
