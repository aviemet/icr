import { FloatingIndicator, Portal } from "@mantine/core"
import clsx from "clsx"
import { useState } from "react"

import { Box, Paper, Container } from "@/components"
import { Routes } from "@/lib"
import { useLocation } from "@/lib/hooks"

import SettingsNavLink from "./SettingsNavLink"
import AppLayout from "../AppLayout"
import * as classes from "./SettingsLayout.css"

interface SettingsLayoutProps {
	children: React.ReactNode
}

const links = [
	{ label: "General", href: Routes.settingsGeneral() },
	{ label: "Calendar", href: Routes.settingsCalendar() },
	{ label: "People", href: Routes.settingsPeople() },
	{ label: "Job Titles", href: Routes.settingsJobTitles() },
	{ label: "Payroll", href: Routes.settingsPayroll() },
]

const linkIndex = (path: string) => links.findIndex(link => link.href === path || path.startsWith(link.href))

const SettingsLayout = ({ children }: SettingsLayoutProps) => {
	const { pathname } = useLocation()

	const [rootRef, setRootRef] = useState<HTMLElement | null>(null)
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLAnchorElement | null>>({})
	const [active, setActive] = useState(linkIndex(pathname))

	const setControlRef = (index: number) => (node: HTMLAnchorElement) => {
		controlsRefs[index] = node
		setControlsRefs(controlsRefs)
	}

	const handleNavLinkClick = (index: number) => {
		setActive(index)
	}

	return (
		<AppLayout>
			<Portal target="#above-content-portal">
				<Container>
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
								onClick={ () => handleNavLinkClick(index) }
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

export default SettingsLayout
