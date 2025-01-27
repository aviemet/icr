import { matchesAtPosition, Routes } from "@/lib"
import useStore from "@/lib/store"
import { useLocation, usePageProps } from "@/lib/hooks"
import IconProvider from "@/Layouts/Providers/IconProvider"
import {
	Group,
	AppShell,
	Box,
	Flex,
	Text,
	Link,
	Tooltip,
	Avatar,
} from "@/Components"
import { TextInput } from "@/Components/Inputs"
import { ClientIcon, ClockIcon, DashboardIcon, EmployeeIcon, LogoutIcon, NextIcon, SettingsIcon } from "@/Components/Icons"
import ToggleSidebarButton from "../ToggleSidebarButton"
import MenuLink from "./MenuLink"

import cx from "clsx"
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
				className={ cx(classes.navbar, { closed: !sidebarOpen }) }
			>
				{ /* Hamburger */ }
				<AppShell.Section p="xs">
					<Group justify="flex-end">
						<ToggleSidebarButton />
					</Group>

					{ /* User menu and Logo */ }
					<Group>
						<UserMenu />
						<Flex
							direction="column"
							wrap="nowrap"
							className={ cx("hidden-when-closed") }
						>
							<Box><Text size="xl" fw={ 700 }>{ siteTitle }</Text></Box>
							<Box><Text size="sm">{ user?.person?.name }</Text></Box>
						</Flex>
					</Group>
				</AppShell.Section>

				<AppShell.Section p="xs" className={ cx("hidden-when-closed") }>
					<TextInput placeholder="Search" />
				</AppShell.Section>

				<AppShell.Section p={ 0 } grow className={ cx(classes.navigation) }>
					<MenuLink
						label="Dashboard"
						href={ Routes.root() }
						leftSection={ <DashboardIcon /> }
						rightSection={ matchesAtPosition(paths, [0, ""]) && <NextIcon /> }
						active={ matchesAtPosition(paths, [0, ""]) }
					/>
					{ permissions?.clients?.index && <MenuLink
						label="Clients"
						href={ Routes.clients() }
						leftSection={ <ClientIcon /> }
						rightSection={ matchesAtPosition(paths, [0, "clients"]) && <NextIcon /> }
						active={ matchesAtPosition(paths, [0, "clients"]) }
					/> }
					<MenuLink
						label="Employees"
						href={ Routes.employees() }
						leftSection={ <EmployeeIcon /> }
						rightSection={ matchesAtPosition(paths, [0, "employees"]) && <NextIcon /> }
						active={ matchesAtPosition(paths, [0,  "employees"]) }
					/>
					<MenuLink
						label="Payroll"
						href={ Routes.payrolls() }
						leftSection={ <ClockIcon /> }
						rightSection={ matchesAtPosition(paths, [0, "payroll"]) && <NextIcon /> }
						active={ matchesAtPosition(paths, [0, "payroll"]) }
					/>
				</AppShell.Section>

				<AppShell.Section p={ 0 }>
					<MenuLink
						label="Settings"
						href={ Routes.settings() }
						leftSection={ <SettingsIcon /> }
						rightSection={ matchesAtPosition(paths, [0, "settings"]) && <NextIcon /> }
						active={  matchesAtPosition(paths, [0, "settings"]) }
					/>
				</AppShell.Section>

			</AppShell.Navbar>
		</IconProvider>
	)
}

export default Sidebar
