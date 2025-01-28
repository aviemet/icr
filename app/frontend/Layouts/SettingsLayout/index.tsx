import { Box, Paper } from "@/Components"
import SettingsNavLink from "./SettingsNavLink"
import { useState } from "react"
import { FloatingIndicator, Portal } from "@mantine/core"
import AppLayout from "../AppLayout"
import { useLocation } from "@/lib/hooks"

import cx from "clsx"
import * as classes from "./SettingsLayout.css"

interface SettingsLayoutProps {
	children: React.ReactNode
}

const links = [
	{ label: "General", href: "/settings/general" },
	{ label: "People", href: "/settings/people" },
	{ label: "Job Titles", href: "/settings/job_titles" },
	{ label: "Calendar", href: "/settings/calendar" },
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
				<Paper
					ref={ setRootRef }
					withBorder
					component="nav"
					shadow="xs"
					p="sm"
					m="sm"
					className={ cx(classes.settingsLayout) }
				>
					{ links.map((link, index) => (
						<SettingsNavLink
							ref={ setControlRef(index) }
							key={ link.label }
							href={ link.href }
							onClick={ () => handleNavLinkClick(index) }
							className={ cx("control") }
							mod={ { active: active === index } }
						>
							{ link.label }
						</SettingsNavLink>
					)) }

					<FloatingIndicator
						target={ controlsRefs[active] }
						parent={ rootRef }
						className={ cx("indicator") }
					/>

				</Paper>
			</Portal>
			<Box>
				{ children }
			</Box>
		</AppLayout>
	)
}

export default SettingsLayout
