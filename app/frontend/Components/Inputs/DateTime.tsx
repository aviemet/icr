import React from 'react'
import { DateTimePicker, DateTimePickerProps } from '@mantine/dates'
import { CalendarIcon } from '../Icons'

export interface IDateTimeProps extends DateTimePickerProps {
	name?: string
	id?: string
	value?: Date
	onChange?: (value: Date) => void
	error?: string | string[]
}

const DateTime = ({
	id,
	name,
	value = new Date(),
	size = 'md',
	radius = 'xs',
	valueFormat = 'L LT',
	mt = 'md',
	...props
}: IDateTimeProps) => {
	const inputId = id || name

	return (
		<DateTimePicker
			id={ inputId }
			name={ name }
			value={ value }
			radius={ radius }
			size={ size }
			valueFormat={ valueFormat }
			icon={ <CalendarIcon /> }
			mt={ mt }
			{ ...props }
		/>
	)
}

export default DateTime

