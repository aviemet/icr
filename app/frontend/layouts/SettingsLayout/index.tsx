import { FloatingIndicator, Portal } from "@mantine/core"
import clsx from "clsx"
import { useState } from "react"

import { Box, Paper, Container, Stack } from "@/components"
import { Routes } from "@/lib"
import { useLocation } from "@/lib/hooks"

import { SettingsNavLink } from "./SettingsNavLink"
import { AppLayout } from "../AppLayout"
import * as classes from "./SettingsLayout.css"

export interface SettingsLayoutProps {
	children: React.ReactNode
}

type SettingsNavChild = {
	label: string
	href: string
}

type SettingsNavLinkItem = {
	label: string
	href: string
	matchPrefixes?: string[]
	children?: SettingsNavChild[]
}

const links: SettingsNavLinkItem[] = [
	{ label: "General", href: Routes.settingsGeneral() },
	{
		label: "Calendar",
		href: Routes.settingsCalendar(),
		matchPrefixes: ["/settings/calendar"],
		children: [
			{ label: "Display", href: Routes.settingsCalendar() },
			{ label: "Shift Types", href: Routes.settingsCalendarShiftTypes() },
		],
	},
	{
		label: "Company",
		href: Routes.settingsCompany(),
		matchPrefixes: ["/settings/company", "/settings/job_titles", "/settings/departments"],
		children: [
			{ label: "Details", href: Routes.settingsCompany() },
			{ label: "Job Titles", href: Routes.settingsJobTitles() },
			{ label: "Departments", href: Routes.settingsDepartments() },
		],
	},
	{ label: "People", href: Routes.settingsPeople() },
	{
		label: "Payroll",
		href: Routes.settingsPayrollSchedule(),
		matchPrefixes: ["/settings/payroll"],
		children: [
			{ label: "Pay Schedule", href: Routes.settingsPayrollSchedule() },
			{ label: "Overtime", href: Routes.settingsPayrollOvertime() },
		],
	},
]

function matchesPrefix(prefix: string, path: string) {
	return path === prefix || path.startsWith(`${prefix}/`)
}

function isParentActive(link: SettingsNavLinkItem, path: string) {
	if(link.matchPrefixes?.length) {
		return link.matchPrefixes.some(prefix => matchesPrefix(prefix, path))
	}
	return matchesPrefix(link.href, path)
}

function activeChildIndex(subLinks: SettingsNavChild[], path: string) {
	const exactIndex = subLinks.findIndex(link => link.href === path)
	if(exactIndex >= 0) return exactIndex

	let bestIndex = -1
	let bestLength = -1
	subLinks.forEach((link, index) => {
		if(path.startsWith(`${link.href}/`) && link.href.length > bestLength) {
			bestIndex = index
			bestLength = link.href.length
		}
	})
	return Math.max(0, bestIndex)
}

const linkIndex = (path: string) => links.findIndex(link => isParentActive(link, path))

export function SettingsLayout({ children }: SettingsLayoutProps) {
	const { pathname } = useLocation()

	const [rootRef, setRootRef] = useState<HTMLElement | null>(null)
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLAnchorElement | null>>({})
	const [subRootRef, setSubRootRef] = useState<HTMLElement | null>(null)
	const [subControlsRefs, setSubControlsRefs] = useState<Record<string, HTMLAnchorElement | null>>({})

	const active = linkIndex(pathname)
	const activeLink = links[active]
	const subLinks = activeLink?.children
	const activeSubIndex = subLinks ? activeChildIndex(subLinks, pathname) : -1

	const setControlRef = (index: number) => (node: HTMLAnchorElement) => {
		controlsRefs[index] = node
		setControlsRefs(controlsRefs)
	}

	const setSubControlRef = (index: number) => (node: HTMLAnchorElement) => {
		subControlsRefs[index] = node
		setSubControlsRefs(subControlsRefs)
	}

	return (
		<AppLayout>
			<Portal target="#above-content-portal">
				<Container>
					<Stack gap="xs">
						<Paper
							ref={ setRootRef }
							withBorder
							component="nav"
							shadow="xs"
							className={ clsx(classes.settingsLayout) }
						>
							{ links.map((link, index) => (
								<SettingsNavLink
									ref={ setControlRef(index) }
									key={ link.label }
									href={ link.href }
									className={ clsx("control") }
									mod={ { active: active === index } }
								>
									{ link.label }
								</SettingsNavLink>
							)) }

							<FloatingIndicator
								target={ controlsRefs[active] }
								parent={ rootRef }
								className={ clsx("indicator") }
							/>
						</Paper>

						{ subLinks && (
							<Paper
								ref={ setSubRootRef }
								withBorder
								component="nav"
								shadow="xs"
								className={ clsx(classes.settingsLayout, classes.settingsSubNav) }
							>
								{ subLinks.map((link, index) => (
									<SettingsNavLink
										ref={ setSubControlRef(index) }
										key={ link.label }
										href={ link.href }
										className={ clsx("control") }
										mod={ { active: activeSubIndex === index } }
									>
										{ link.label }
									</SettingsNavLink>
								)) }

								<FloatingIndicator
									target={ subControlsRefs[activeSubIndex] }
									parent={ subRootRef }
									className={ clsx("indicator") }
								/>
							</Paper>
						) }
					</Stack>
				</Container>
			</Portal>

			<Box>
				<Container>
					{ children }
				</Container>
			</Box>
		</AppLayout>
	)
}
