import React, { useState } from 'react'
import { TextField } from '@mui/material'
import MuiDateTimePicker, { DateTimePickerProps } from '@mui/lab/DateTimePicker'
import { useForm } from './Form'

interface IDTPickerProps extends Omit<DateTimePickerProps, 'renderInput'|'onChange'|'value'>{
	name: string
	onChange?: (date: Date) => void
}

const DateTimePicker = ({ name, label, onChange, ...props }: IDTPickerProps) => {
	const [open, setOpen] = useState(false)

	const { data, setData, errors } = useForm()

	return (
		<MuiDateTimePicker
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
