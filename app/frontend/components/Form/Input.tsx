import React, { useEffect } from 'react'
import { InputProps } from 'react-html-props'
import { useForm } from './Form'
import {
	TextField,
} from '@mui/material'
interface IInputProps extends InputProps {
	label: string
}

const Input = ({ label, name, onChange, ...props }: IInputProps) => {
	const { data, setData } = useForm()

	return (
		<TextField
			variant="standard"
			label={ label }
			name={ name }
			value={ data[name] }
			onChange={ e => {
				if(onChange) onChange(e)
				setData(name, e.target.value)
			} }
			{ ...props }
		/>
	)
}

export default Input

