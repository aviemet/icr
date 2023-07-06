import React, { forwardRef } from 'react'
import Field from '../Field'
import AutocompleteInput, { type IAutocompleteProps } from '@/Components/Inputs/AutocompleteInput'
import cx from 'clsx'
import { useInertiaInput } from 'use-inertia-form'
import { type IFormInputProps } from '.'

interface IFormAutocompleteProps extends Omit<IAutocompleteProps, 'name'|'onBlur'|'onChange'>, IFormInputProps<string> {
	field?: boolean
	endpoint?: string
}

const FormAutocompleteComponent = forwardRef<HTMLInputElement, IFormAutocompleteProps>((
	{
		name,
		model,
		onChange,
		onBlur,
		id,
		required,
		compact = false,
		errorKey,
		field = true,
		endpoint,
		 ...props
	},
	ref,
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string>({ name, model })

	const handleChange = (parameter: string) => {
		setValue(parameter)
		if(onChange) onChange(parameter, form)
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		if(onBlur) onBlur(value, form)
	}

	return (
		<AutocompleteInput
			id={ id || inputId }
			className={ cx({ compact }) }
			name={ inputName }
			value={ value }
			onChange={ handleChange }
			onBlur={ handleBlur }
			error={ errorKey ? form.getError(errorKey) : error }
			ref={ ref }
			wrapperProps={ {
				component: Field,
				className: cx({ compact, required }),
				errors: Boolean(error),
				sx: { padding: 0 },
			} }
			{ ...props }
		/>

	)
})

export default FormAutocompleteComponent

/**
 * <ConditionalWrapper
			wrapper={ children => (
				<Field
					type="search"
					className={ cx({ compact }) }
					required={ required }
					errors={ !!error }
				>
					{ children }
				</Field>
			) }
			condition={ field }
		>

		</ConditionalWrapper>
 */
