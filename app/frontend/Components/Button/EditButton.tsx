import React from 'react'
import { Link, Tooltip } from '@/Components'
import { EditIcon } from '@/Components/Icons'
import { LinkProps } from '../Link'
import { useMantineTheme } from '@mantine/core'
import useStore from '@/lib/store'

interface EditButtonProps extends Omit<LinkProps, 'children'> {
	label?: string
}

const EditButton = ({ href, label }: EditButtonProps) => {
	const { primaryColor } = useMantineTheme()
	const { getContrastingColor } = useStore()

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
				<EditIcon color={ getContrastingColor(primaryColor) } />
			</Link>
		</Tooltip>
	)
}

export default EditButton
