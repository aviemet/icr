import { FloatingIndicator } from "@mantine/core"
import clsx from "clsx"
import { useMemo, useState } from "react"

import { Box } from "@/components"
import {
	AdjustmentsIcon,
	BuildingIcon,
	CalendarIcon,
	ClockIcon,
	NotificationIcon,
	PeopleIcon,
	UserSettingsIcon,
} from "@/components/Icons"
import { pageChrome } from "@/components/PageChrome"
import { Routes } from "@/lib"
import { useFeatures, useLocation } from "@/lib/hooks"

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
	icon: React.ReactNode
	matchPrefixes?: string[]
	children?: SettingsNavChild[]
}

function buildSettingsLinks(complianceFormsEnabled: boolean): SettingsNavLinkItem[] {
	const companyMatchPrefixes = [
		"/settings/company",
		"/settings/job_titles",
		"/settings/departments",
		"/settings/requirements",
		"/settings/requirement_types",
	]
	const companyChildren: SettingsNavChild[] = [
		{ label: "Details", href: Routes.settingsCompany() },
		{ label: "Job Titles", href: Routes.settingsJobTitles() },
		{ label: "Departments", href: Routes.settingsDepartments() },
		{ label: "Requirements", href: Routes.settingsRequirements() },
	]

	if(complianceFormsEnabled) {
		companyMatchPrefixes.push("/settings/compliance_form_templates")
		companyChildren.push({ label: "Compliance forms", href: Routes.settingsComplianceFormTemplates() })
	}

	return [
		{ label: "General", href: Routes.settingsGeneral(), icon: <AdjustmentsIcon /> },
		{
			label: "Calendar",
			href: Routes.settingsCalendar(),
			icon: <CalendarIcon />,
			matchPrefixes: ["/settings/calendar"],
			children: [
				{ label: "Display", href: Routes.settingsCalendar() },
				{ label: "Shift Types", href: Routes.settingsCalendarShiftTypes() },
			],
		},
		{
			label: "Company",
			href: Routes.settingsCompany(),
			icon: <BuildingIcon />,
			matchPrefixes: companyMatchPrefixes,
			children: companyChildren,
		},
		{ label: "People", href: Routes.settingsPeople(), icon: <PeopleIcon /> },
		{
			label: "Payroll",
			href: Routes.settingsPayrollSchedule(),
			icon: <ClockIcon />,
			matchPrefixes: ["/settings/payroll"],
			children: [
				{ label: "Pay Schedule", href: Routes.settingsPayrollSchedule() },
				{ label: "Overtime", href: Routes.settingsPayrollOvertime() },
				{ label: "IHSS", href: Routes.settingsPayrollIhss() },
			],
		},
		{ label: "Notifications", href: Routes.settingsNotifications(), icon: <NotificationIcon /> },
	]
}

const userSettingsLink = {
	label: "User Settings",
	href: Routes.settingsUser(),
	icon: <UserSettingsIcon />,
}

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

export function SettingsLayout({ children }: SettingsLayoutProps) {
	const { pathname } = useLocation()
	const { enabled } = useFeatures()
	const links = useMemo(() => buildSettingsLinks(enabled("compliance_forms")), [enabled])

	const [rootRef, setRootRef] = useState<HTMLElement | null>(null)
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLAnchorElement | null>>({})
	const [userControlRef, setUserControlRef] = useState<HTMLAnchorElement | null>(null)
	const active = links.findIndex(link => isParentActive(link, pathname))
	const userActive = matchesPrefix(userSettingsLink.href, pathname)
	const activeLink = userActive ? undefined : links[active]
	const subLinks = activeLink?.children
	const activeSubIndex = subLinks ? activeChildIndex(subLinks, pathname) : -1
	const indicatorTarget = userActive ? userControlRef : controlsRefs[active]

	const setControlRef = (index: number) => (node: HTMLAnchorElement) => {
		controlsRefs[index] = node
		setControlsRefs(controlsRefs)
	}

	return (
		<AppLayout>
			<div className={ classes.viewport }>
				<div className={ classes.shell }>
					<nav className={ clsx(pageChrome.panelSurface, classes.chrome) }>
						<Box className="parentRow" ref={ setRootRef }>
							<div className="companyLinks">
								{ links.map((link, index) => (
									<SettingsNavLink
										ref={ setControlRef(index) }
										key={ link.label }
										href={ link.href }
										icon={ link.icon }
										className={ clsx("control") }
										mod={ { active: !userActive && active === index } }
									>
										{ link.label }
									</SettingsNavLink>
								)) }
							</div>

							<SettingsNavLink
								ref={ setUserControlRef }
								href={ userSettingsLink.href }
								icon={ userSettingsLink.icon }
								className={ clsx("control", "userSettingsLink") }
								mod={ { active: userActive } }
							>
								{ userSettingsLink.label }
							</SettingsNavLink>

							<FloatingIndicator
								target={ indicatorTarget }
								parent={ rootRef }
								className={ clsx("indicator") }
							/>
						</Box>

						{ subLinks && (
							<Box className="childRow">
								{ subLinks.map((link, index) => (
									<SettingsNavLink
										key={ link.label }
										href={ link.href }
										className={ clsx("control") }
										mod={ { active: activeSubIndex === index } }
									>
										{ link.label }
									</SettingsNavLink>
								)) }
							</Box>
						) }
					</nav>

					<div className={ classes.body }>
						{ children }
					</div>
				</div>
			</div>
		</AppLayout>
	)
}
