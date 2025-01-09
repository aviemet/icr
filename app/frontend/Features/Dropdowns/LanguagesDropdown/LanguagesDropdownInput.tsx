import React, { forwardRef } from 'react'
import { Select as InputSelect } from '@/Components/Inputs'
import { useGetLanguages } from '@/queries/locale'
import { isEmpty } from 'lodash'
import { type AsyncDropdown } from '..'

interface LanguagesDropdownProps extends AsyncDropdown<Schema.LanguageOption> {}

const LanguagesDropdown = forwardRef<HTMLInputElement, LanguagesDropdownProps>((
	{
		label = 'Language',
		name = 'language',
		...props
	},
	ref,
) => {
	const { data, refetch } = useGetLanguages({
		staleTime: Infinity,
	})

	return <InputSelect
		ref={ ref }
		label={ label }
		name={ name }
		options={ !data
			? []
			: data.map(language => ({
				label: `${language.code} (${language.symbol})`,
				value: String(language.code),
			})) }
		onDropdownOpen={ () => {
			if(isEmpty(data)) refetch()
		} }
		searchable
		clearable
		{ ...props }
	/>
})

export default LanguagesDropdown
