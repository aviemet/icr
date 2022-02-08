import React, { useState } from 'react'
import { TextField } from '@mui/material'
import MuiDatePicker, { DatePickerProps } from '@mui/lab/DatePicker'
import { useForm } from './Form'

interface IDatePickerProps extends Omit<DatePickerProps, 'renderInput'>{
	name: string
}

const DateTimePicker = ({ name, label, value, onChange, ...props }: IDatePickerProps) => {
	const [open, setOpen] = useState(false)

	const { data, setData, errors } = useForm()

	return (
		<MuiDatePicker
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
