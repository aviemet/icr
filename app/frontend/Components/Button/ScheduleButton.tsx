import { useMantineTheme } from "@mantine/core"

import { Link, Tooltip } from "@/Components"
import { CalendarIcon } from "@/Components/Icons"
import useStore from "@/lib/store"

import { LinkProps } from "../Link"

interface ScheduleButtonProps extends Omit<LinkProps, "children"> {
	label?: string
}

const ScheduleButton = ({ href, label }: ScheduleButtonProps) => {
	const { primaryColor } = useMantineTheme()
	const { getContrastingColor } = useStore()

	const usedLabel = `Schedule${label ? ` ${label}` : ""}`

	return (
		<Tooltip
			withArrow
			label={ usedLabel }
			position="left"
			transitionProps={ { transition: "fade" } }
			aria-label={ usedLabel }
			color={ primaryColor }
		>
			<Link as="button" href={ href } aria-label={ `Schedule ${label}` }>
				<CalendarIcon color={ getContrastingColor(primaryColor) } />
			</Link>
		</Tooltip>
	)
}

export default ScheduleButton
