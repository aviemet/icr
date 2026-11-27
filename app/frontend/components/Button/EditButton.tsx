import { type TooltipProps } from "@mantine/core"

import { ActionIcon, Link, Tooltip } from "@/components"
import { EditIcon } from "@/components/Icons"

import * as classes from "./IconActionButton.css"

interface EditButtonProps {
	href?: string
	label?: string
	onClick?: () => void
	tooltipPosition?: TooltipProps["position"]
}

export function EditButton({ href, label, onClick, tooltipPosition = "left" }: EditButtonProps) {
	const usedLabel = `Edit${label ? ` ${label}` : ""}`

	return (
		<Tooltip
			withArrow
			label={ usedLabel }
			position={ tooltipPosition }
			transitionProps={ { transition: "fade" } }
		>
			{ href
				? (
					<ActionIcon
						component={ Link }
						href={ href }
						variant="transparent"
						aria-label={ usedLabel }
						className={ classes.iconAction }
					>
						<EditIcon size={ 14 } />
					</ActionIcon>
				)
				: (
					<ActionIcon
						variant="transparent"
						aria-label={ usedLabel }
						className={ classes.iconAction }
						onClick={ onClick }
					>
						<EditIcon size={ 14 } />
					</ActionIcon>
				) }
		</Tooltip>
	)
}
