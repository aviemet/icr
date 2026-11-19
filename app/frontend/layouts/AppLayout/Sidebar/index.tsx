import clsx from "clsx"

import {
	Group,
	AppShell,
	Box,
	Flex,
	Text,
	Divider,
} from "@/components"
import { ClientIcon, ClockIcon, DashboardIcon, EmployeeIcon, HelpingIcon, SettingsIcon } from "@/components/Icons"
import { IconProvider } from "@/layouts/Providers/IconProvider"
import { matchesAtPosition, Routes } from "@/lib"
import { useLocation, usePageProps, usePermissions } from "@/lib/hooks"
import { useStore } from "@/lib/store"

import { ToggleSidebarButton } from "../ToggleSidebarButton"
import { MenuLink } from "./MenuLink"
import * as classes from "../AppLayout.css"
import { UserMenu } from "./UserMenu"

export function Sidebar() {
	const { auth: { user } } = usePageProps()
	const { can } = usePermissions()
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
					<Group gap={ sidebarOpen ? "sm" : 0 } wrap="nowrap" justify="center">
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

				<AppShell.Section mt="xs" p={ 0 } grow className={ clsx(classes.nav, "nav-section") }>
					<ul>
						<MenuLink
							label="Dashboard"
							href={ Routes.root() }
							leftSection={ <DashboardIcon /> }
							active={ matchesAtPosition(paths, [0, ""]) }
						/>
						{ can("clients", "index") && (
							<MenuLink
								label="Clients"
								href={ Routes.clients() }
								leftSection={ <ClientIcon /> }
								active={ matchesAtPosition(paths, [0, "clients"]) }
							>
								{ can("households", "index") && (
									<MenuLink
										label="Households"
										href={ Routes.households() }
									/>
								) }
								{ can("doctors", "index") && (
									<MenuLink
										label="Doctors"
										href={ Routes.doctors() }
									/>
								) }
							</MenuLink>
						) }
						{ can("employees", "index") && (
							<MenuLink
								label="Employees"
								href={ Routes.employees() }
								leftSection={ <EmployeeIcon /> }
								active={ matchesAtPosition(paths, [0, "employees"]) }
							>
								{ can("requirement/requirements", "index") && (
									<MenuLink
										label="Documents"
										href={ Routes.requirements() }
									/>
								) }
								{ can("employee/trainings", "index") && (
									<MenuLink
										label="Training"
										href={ Routes.trainings() }
									/>
								) }
							</MenuLink>
						) }
						{ can("timesheets", "index") && (
							<MenuLink
								label="Payroll"
								href={ Routes.payrollPeriods() }
								leftSection={ <ClockIcon /> }
								active={ matchesAtPosition(paths, [0, "payroll"]) }
							/>
						) }
						{ can("vendors", "index") && (
							<MenuLink
								label="Vendors"
								href={ Routes.vendors() }
								leftSection={ <HelpingIcon /> }
								active={ matchesAtPosition(paths, [0, "vendors"]) }
							/>
						) }
					</ul>
				</AppShell.Section>
				{ can("settings", "index") && (
					<AppShell.Section p={ 0 } className={ clsx(classes.nav, "nav-section") }>
						<ul>
							<MenuLink
								label="Settings"
								href={ Routes.settings() }
								leftSection={ <SettingsIcon /> }
								active={ matchesAtPosition(paths, [0, "settings"]) }
							/>
						</ul>
					</AppShell.Section>
				) }

			</AppShell.Navbar>
		</IconProvider>
	)
}
