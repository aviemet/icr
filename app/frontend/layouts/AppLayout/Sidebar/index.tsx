import clsx from "clsx"
import { useTranslation } from "react-i18next"

import {
	Group,
	AppShell,
	Box,
	Flex,
	Text,
	Divider,
} from "@/components"
import { CalendarIcon, ClientIcon, ClockIcon, ColumnsIcon, DashboardIcon, DoctorIcon, EmployeeIcon, HelpingIcon, PeopleIcon, SettingsIcon } from "@/components/Icons"
import { IconProvider } from "@/layouts/Providers/IconProvider"
import { matchesAtPosition, Routes } from "@/lib"
import { useFeatures, useLocation, usePageProps, usePermissions } from "@/lib/hooks"
import { useStore } from "@/lib/store"

import { ToggleSidebarButton } from "../ToggleSidebarButton"
import { MenuLink } from "./MenuLink"
import * as classes from "../AppLayout.css"
import { UserMenu } from "./UserMenu"

export function Sidebar() {
	const { t } = useTranslation()
	const { auth: { user } } = usePageProps()
	const { can } = usePermissions()
	const { enabled } = useFeatures()
	const { sidebarOpen, siteTitle } = useStore()
	const { paths } = useLocation()

	return (
		<IconProvider size="1.2rem">
			<AppShell.Navbar
				p={ 0 }
				hidden={ !sidebarOpen }
				className={ clsx(classes.navbar, { closed: !sidebarOpen }) }
			>
				<AppShell.Section p="xs" mb={ sidebarOpen ? "xs" : 0 } className="header-section">
					{ sidebarOpen
						? (
							<>
								<Group justify="flex-end">
									<ToggleSidebarButton />
								</Group>
								<Group gap="sm" wrap="nowrap" justify="center" align="center">
									<UserMenu />
									<Flex direction="column" wrap="nowrap" className="hidden-when-closed">
										<Box><Text size="xl" fw={ 700 }>{ siteTitle }</Text></Box>
										<Box><Text size="sm">{ user?.person?.name }</Text></Box>
									</Flex>
								</Group>
							</>
						)
						: (
							<Flex direction="column" align="center" gap="xxs">
								<ToggleSidebarButton />
								<UserMenu />
							</Flex>
						) }
				</AppShell.Section>

				<Divider />

				<AppShell.Section
					p={ 0 }
					pt={ sidebarOpen ? 0 : "xxs" }
					mt={ sidebarOpen ? "xs" : 0 }
					grow
					className={ clsx(classes.nav, "nav-section") }
				>
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
								menuKey="clients"
								active={ matchesAtPosition(paths, [0, "clients"]) }
							>
								{ can("households", "index") && (
									<MenuLink
										label="Households"
										href={ Routes.households() }
										active={ matchesAtPosition(paths, [0, "households"]) }
									/>
								) }
							</MenuLink>
						) }
						{ can("employees", "index") && (
							<MenuLink
								label="Employees"
								href={ Routes.employees() }
								leftSection={ <EmployeeIcon /> }
								menuKey="employees"
								active={
									matchesAtPosition(paths, [0, "employees"]) &&
									!matchesAtPosition(paths, [1, "applicants"]) &&
									!matchesAtPosition(paths, [1, "trainings"])
								}
							>
								<MenuLink
									label="Applicants"
									href={ Routes.applicants() }
									active={ matchesAtPosition(paths, [1, "applicants"]) }
								/>
								{ can("employee/trainings", "index") && (
									<MenuLink
										label="Training"
										href={ Routes.trainings() }
										active={ matchesAtPosition(paths, [1, "trainings"]) }
									/>
								) }
							</MenuLink>
						) }
						{ can("clients_managers", "index") && (
							<MenuLink
								label="Caseloads"
								href={ Routes.caseloads() }
								leftSection={ <PeopleIcon /> }
								active={ matchesAtPosition(paths, [0, "caseloads"]) }
							/>
						) }
						{ can("timesheets", "index") && (
							<MenuLink
								label="Payroll"
								href={ Routes.payrollPeriods() }
								leftSection={ <ClockIcon /> }
								active={ matchesAtPosition(paths, [0, "payroll"]) }
							/>
						) }
						{ (can("time_off/requests", "create") || can("time_off/requests", "index") || can("time_off/requests", "show")) && (
							<MenuLink
								label={ t("views.time_off.index.title") }
								href={ Routes.timeOffRequests() }
								leftSection={ <CalendarIcon /> }
								active={ matchesAtPosition(paths, [0, "time_off_requests"]) }
							/>
						) }
						{ can("report_definitions", "index") && (
							<MenuLink
								label="Reports"
								href={ Routes.reportDefinitions() }
								leftSection={ <ColumnsIcon /> }
								menuKey="reports"
								active={
									matchesAtPosition(paths, [0, "reports"]) ||
									matchesAtPosition(paths, [0, "report_requests"])
								}
							>
								{ can("report_requests", "index") && (
									<MenuLink
										label="Report queue"
										href={ Routes.reportRequests() }
										active={ matchesAtPosition(paths, [0, "report_requests"]) }
									/>
								) }
							</MenuLink>
						) }
						{ enabled("vendors") && can("vendors", "index") && (
							<MenuLink
								label="Vendors"
								href={ Routes.vendors() }
								leftSection={ <HelpingIcon /> }
								active={ matchesAtPosition(paths, [0, "vendors"]) }
							/>
						) }
						{ can("doctors", "index") && (
							<MenuLink
								label="Doctors"
								href={ Routes.doctors() }
								leftSection={ <DoctorIcon /> }
								active={ matchesAtPosition(paths, [0, "doctors"]) }
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
