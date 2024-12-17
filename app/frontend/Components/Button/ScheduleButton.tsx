import React from 'react'
import { Link, Tooltip } from '@/Components'
import { CalendarIcon } from '@/Components/Icons'
import { LinkProps } from '../Link'
import { useMantineTheme } from '@mantine/core'
import { useContrastingTextColor } from '@/lib/hooks'

interface ScheduleButtonProps extends Omit<LinkProps, 'children'> {
	label?: string
}

const ScheduleButton = ({ href, label }: ScheduleButtonProps) => {
	const { primaryColor } = useMantineTheme()

	const usedLabel = `Schedule${label ? ` ${label}` : ''}`

	return (
		<Tooltip
			withArrow
			label={ usedLabel }
			position="left"
			transitionProps={ { transition: 'fade' } }
			aria-label={ usedLabel }
			color={ primaryColor }
		>
			<Link as="button" href={ href } aria-label={ `Schedule ${label}` }>
				<CalendarIcon color={ useContrastingTextColor(primaryColor) } />
			</Link>
		</Tooltip>
	)
}

export default ScheduleButton
