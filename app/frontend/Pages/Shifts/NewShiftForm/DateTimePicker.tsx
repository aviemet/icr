import React, { useState } from 'react'
import DateTimePicker, { DateTimePickerProps } from '@mantine/dates'

interface IDTPickerProps extends DateTimePickerProps {
	type?: 'start'|'end'
}

const DTPicker: React.FC<IDTPickerProps> = ({ type = 'start', ...props }) => {
	if(type === 'end') return <><TimePicker { ...props } /><DatePicker { ...props } /></>
	return <><DatePicker { ...props } /><TimePicker { ...props } /></>
}

export const DatePicker = ({ label, ...props }: Omit<DateTimePickerProps, 'renderInput'>) => {
	const [open, setOpen] = useState(false)

	return (
		<DateTimePicker
			inputFormat="EEEE, MMM do"
		/>
	)
}

export const TimePicker = ({ label, ...props }: Omit<DateTimePickerProps, 'renderInput'>) => {
	const [open, setOpen] = useState(false)

	return (
		<DateTimePicker
			inputFormat="hh:mm a"
		/>
	)
}

export default DTPicker
