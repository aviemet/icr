import clsx from "clsx"

import {
	Group,
	AppShell,
	Box,
	Flex,
	Text,
	Divider,
} from "@/Components"
import { ClientIcon, ClockIcon, DashboardIcon, EmployeeIcon, SettingsIcon } from "@/Components/Icons"
import IconProvider from "@/Layouts/Providers/IconProvider"
import { matchesAtPosition, Routes } from "@/lib"
import { useLocation, usePageProps } from "@/lib/hooks"
import useStore from "@/lib/store"

import ToggleSidebarButton from "../ToggleSidebarButton"
import MenuLink from "./MenuLink"
import * as classes from "../AppLayout.css"
import UserMenu from "./UserMenu"

const Sidebar = () => {
	const { auth: { user }, permissions } = usePageProps()
	const { sidebarOpen, siteTitle } = useStore()
	const { paths } = useLocation()

	return (
		<IconProvider size="1.2rem">
			<AppShell.Navbar
				p={ 0 }
				hidden={ !sidebarOpen }
				className={ clsx(classes.navbar, { closed: !sidebarOpen }) }
			>
				{ /* Hamburger */ }
				<AppShell.Section p="xs" mb="xs">
					<Group justify="flex-end">
						<ToggleSidebarButton />
					</Group>

					{ /* User menu and Logo */ }
					<Group>
						<UserMenu />
						<Flex
							direction="column"
							wrap="nowrap"
							className={ clsx("hidden-when-closed") }
						>
							<Box><Text size="xl" fw={ 700 }>{ siteTitle }</Text></Box>
							<Box><Text size="sm">{ user?.person?.name }</Text></Box>
						</Flex>
					</Group>
				</AppShell.Section>

				<Divider />

				<AppShell.Section mt="xs" p={ 0 } grow className={ classes.nav }>
					<ul>
						<MenuLink
							label="Dashboard"
							href={ Routes.root() }
							leftSection={ <DashboardIcon /> }
							active={ matchesAtPosition(paths, [0, ""]) }
						/>
						{ permissions?.clients?.index && (
							<MenuLink
								label="Clients"
								href={ Routes.clients() }
								leftSection={ <ClientIcon /> }
								active={ matchesAtPosition(paths, [0, "clients"]) }
							/>
						) }
						<MenuLink
							label="Employees"
							href={ Routes.employees() }
							leftSection={ <EmployeeIcon /> }
							active={ matchesAtPosition(paths, [0, "employees"]) }
						>
							<MenuLink
								label="Training"
								href={ Routes.trainings() }
							/>
						</MenuLink>
						<MenuLink
							label="Timesheets"
							href={ Routes.timesheets() }
							leftSection={ <ClockIcon /> }
							active={ matchesAtPosition(paths, [0, "timesheets"]) }
						/>
					</ul>
				</AppShell.Section>
				<AppShell.Section>
					<ul>
						<MenuLink
							label="Settings"
							href={ Routes.settings() }
							leftSection={ <SettingsIcon /> }
							active={ matchesAtPosition(paths, [0, "settings"]) }
						/>
					</ul>
				</AppShell.Section>

			</AppShell.Navbar>
		</IconProvider>
	)
}

export default Sidebar
