import React, { useState } from 'react'
import { TextField } from '@mui/material'
import MuiTimePicker, { TimePickerProps } from '@mui/lab/TimePicker'
import { useForm } from './Form'

interface ITimePickerProps extends Omit<TimePickerProps, 'renderInput'>{
	name: string
}

const DateTimePicker = ({ name, label, value, onChange, ...props }: ITimePickerProps) => {
	const [open, setOpen] = useState(false)

	const { data, setData, errors } = useForm()

	return (
		<MuiTimePicker
			open={ open }
			onOpen={ () => setOpen(true) }
			onClose={ () => setOpen(false) }
			components={ { OpenPickerIcon: () => <></> } }
			value={ data[name] }
			onChange={ val => {
				if(onChange) onChange(val)
				if(!(val instanceof Date)) return
				setData('starts_at', val)
			} }
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

export default DateTimePicker
