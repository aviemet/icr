import React from 'react'
import {
	Autocomplete as MuiAutocomplete,
	AutocompleteProps,
	FormHelperText,
	TextField,
} from '@mui/material'
import { useForm } from './Form'

interface IAutocompleteProps extends AutocompleteProps<object, true, false, false> {
	label: string
	name: string
	valueKey: string
}

const Autocomplete = ({ label, id, valueKey, name, options, ...props }: IAutocompleteProps) => {
	const { data, setData, errors } = useForm()

	const handleChange = (event, value) => {
		console.log({ name, value })
		setData(name, value?.[valueKey || 'id'])
	}

	console.log({ data })

	return (
		<>
			<MuiAutocomplete
				fullWidth
				disablePortal
				size="small"
				id={ id || `${name}-input` }
				options={ options }
				onChange={ handleChange }
				aria-describedby={ `${name}-error-text` }
				{ ...props }
				renderInput={ params => {
					params.fullWidth = true
					return <TextField
						variant="standard"
						{ ...params }
						inputProps={ { ...params.inputProps } }
						error={ !!errors[name] }
						value={ `${data?.[name]}` || '' }
						label={ label }
					/>
				} }
			/>
			{ errors[name] && <FormHelperText id={ `${name}-error-text` }>
				{ errors[name] }
			</FormHelperText> }
		</>
	)
}

export default Autocomplete
