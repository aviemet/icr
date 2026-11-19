import { ActionIcon, Link, Tooltip } from "@/components"
import { CalendarIcon } from "@/components/Icons"

import * as classes from "./IconActionButton.css"

interface ScheduleButtonProps {
	href: string
	label?: string
	appearance?: "icon" | "button"
}

export function ScheduleButton({ href, label, appearance = "icon" }: ScheduleButtonProps) {
	const usedLabel = `Schedule${label ? ` ${label}` : ""}`

	if(appearance === "button") {
		return (
			<Link
				href={ href }
				as="button"
				buttonProps={ {
					variant: "light",
					size: "sm",
					leftSection: <CalendarIcon size={ 14 } />,
				} }
			>
				{ usedLabel }
			</Link>
		)
	}

	return (
		<Tooltip
			withArrow
			label={ usedLabel }
			position="left"
			transitionProps={ { transition: "fade" } }
		>
			<ActionIcon
				component={ Link }
				href={ href }
				variant="transparent"
				aria-label={ usedLabel }
				className={ classes.iconAction }
			>
				<CalendarIcon size={ 14 } />
			</ActionIcon>
		</Tooltip>
	)
}
