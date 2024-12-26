import React from 'react'
import { IconButton } from '@/Components'
import { modals } from '@mantine/modals'
import { ActionIconProps } from '@mantine/core'

import cx from 'clsx'
import * as classes from './Calendar.css'
import { PlusIcon } from '../Icons'

interface NewShiftButtonProps extends ActionIconProps,
	Omit<React.ComponentPropsWithoutRef<'button'>, keyof ActionIconProps> {}

const NewShiftButton = ({
	className,
	onClick,
	variant = 'subtle',
	...props
}: NewShiftButtonProps) => {
	const handleModalOpen = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		modals.open({
			title: 'New Shift',
			children: (
				<div>
					New Shift
				</div>
			),
		})

		onClick?.(e)
	}

	return (
		<IconButton
			{ ...props }
			variant={ variant }
			onClick={ handleModalOpen }
			className={ cx(className, classes.newShiftButton) }
			size="xs"
		>
			<PlusIcon />
		</IconButton>
	)
}

export default NewShiftButton
