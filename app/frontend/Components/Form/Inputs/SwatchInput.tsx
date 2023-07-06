import React, { forwardRef } from 'react'
import { useInertiaInput } from 'use-inertia-form'
import SwatchInput, { type ISwatchInputProps } from '@/Components/Inputs/SwatchInput'
import ConditionalWrapper from '@/Components/ConditionalWrapper'
import cx from 'clsx'
import Field from '../Field'
import { type IFormInputProps } from '.'

interface ISwatchFormInputProps extends Omit<ISwatchInputProps, 'onBlur'|'onChange'|'name'|'ref'>, IFormInputProps<string> {}

const SwatchFormInput = forwardRef<HTMLInputElement, ISwatchFormInputProps>((
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
		...props
	},
	ref,
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string>({ name, model })

	const handleChange = (color: string) => {
		setValue(color)

		if(onChange) onChange(color, form)
	}

	return (
		<ConditionalWrapper
			wrapper={ children => (
				<Field
					type="text"
					required={ required }
					className={ cx({ compact }) }
					errors={ !!error }
				>
					{ children }
				</Field>
			) }
			condition={ field }
		>
			<SwatchInput
				initialValue={ value }
				value={ value }
				onChange={ handleChange }
				name={ inputName }
				id={ inputId }
				ref={ ref }
				{ ...props }
			/>
		</ConditionalWrapper>
	)
})

export default SwatchFormInput
