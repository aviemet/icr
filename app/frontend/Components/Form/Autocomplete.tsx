import React from 'react'
import { useForm } from 'use-inertia-form'
import { Autocomplete, type AutocompleteProps, type AutocompleteItem } from '@mantine/core'

interface IAutocompleteProps extends Omit<AutocompleteProps, 'data'> {
	name: string
	options: readonly (string | AutocompleteItem)[]
}

const AutocompleteComponent = ({ label, id, name, options, ...props }: IAutocompleteProps) => {
	const { setData } = useForm()

	const handleChange = (value: string) => {
		setData(name, value)
	}

	return (
		<Autocomplete
			data={ options }
			label={ label }
			id={ id || `${name}-input` }
			onChange={ handleChange }
			{ ...props }
		/>
	)
}

export default AutocompleteComponent
