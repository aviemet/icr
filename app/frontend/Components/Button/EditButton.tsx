import React from 'react'
import { Link, Tooltip } from '@/Components'
import { EditIcon } from '@/Components/Icons'
import { LinkProps } from '../Link'
import { useMantineTheme } from '@mantine/core'
import { useContrastingTextColor } from '@/lib/hooks'

interface EditButtonProps extends Omit<LinkProps, 'children'> {
	label?: string
}

const EditButton = ({ href, label }: EditButtonProps) => {
	const { primaryColor } = useMantineTheme()

	const usedLabel = `Edit${label ? ` ${label}` : ''}`

	return (
		<Tooltip
			withArrow
			label={ usedLabel }
			position="left"
			transitionProps={ { transition: 'fade' } }
			aria-label={ usedLabel }
			color={ primaryColor }
		>
			<Link as="button" href={ href } aria-label={ `Edit ${label}` }>
				<EditIcon color={ useContrastingTextColor(primaryColor) } />
			</Link>
		</Tooltip>
	)
}

export default EditButton
