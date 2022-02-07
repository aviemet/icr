import React, { useState } from 'react'
import { TextField } from '@mui/material'
import DateTimePicker, { DateTimePickerProps } from '@mui/lab/DateTimePicker'

interface IDTPickerProps extends Omit<DateTimePickerProps, 'renderInput'> {
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
			open={ open }
			onOpen={ () => setOpen(true) }
			onClose={ () => setOpen(false) }
			inputFormat="EEEE, MMM do"
			components={ { OpenPickerIcon: () => <></> } }
			{ ...props }
			renderInput={ params => {
				params.inputProps = params.inputProps || {}
				params.inputProps.readOnly = true
				return (
					<TextField
						{ ...params }
						onClick={ () => setOpen(true) }
						variant="standard"
						helperText={ label }
					/>
				)
			} }
		/>
	)
}

export const TimePicker = ({ label, ...props }: Omit<DateTimePickerProps, 'renderInput'>) => {
	const [open, setOpen] = useState(false)

	return (
		<DateTimePicker
			open={ open }
			onOpen={ () => setOpen(true) }
			onClose={ () => setOpen(false) }
			openTo="hours"
			inputFormat="hh:mm a"
			components={ { OpenPickerIcon: () => <></> } }
			{ ...props }
			renderInput={ params => {
				params.inputProps = params.inputProps || {}
				params.inputProps.readOnly = true
				return (
					<TextField
						{ ...params }
						onClick={ () => setOpen(true) }
						variant="standard"
						helperText={ label }
					/>
				)
			} }
		/>
	)
}

export default DTPicker
