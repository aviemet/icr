import React from 'react'
import { Select as FormSelect } from '@/Components/Form'
import { useGetLanguages } from '@/queries/locale'
import { isEmpty } from 'lodash'
import { type FormAsyncDropdown } from '..'

interface FormLanguagesDropdownProps extends Omit<FormAsyncDropdown<Schema.LanguageOption>, 'name'> {
	name?: string
}

const FormLanguagesDropdown = ({
	label = 'Languages',
	name = 'languages',
	...props
}: FormLanguagesDropdownProps) => {
	const { data, refetch } = useGetLanguages({
		staleTime: Infinity,
	})

	return (
		<FormSelect
			label={ label }
			name={ name }
			options={ data }
			onDropdownOpen={ () => {
				if(isEmpty(data)) refetch()
			} }
			searchable
			clearable
			{ ...props }
		/>
	)

}

export default FormLanguagesDropdown
