import React, { forwardRef } from 'react'
import { type Sx } from '@mantine/core'
import Field from '../Field'
import CheckboxInput, { type ICheckboxProps } from '@/Components/Inputs/Checkbox'
import { useInertiaInput } from 'use-inertia-form'
import ConditionalWrapper from '@/Components/ConditionalWrapper'
import { type IFormInputProps } from '.'

interface IFormCheckboxProps extends Omit<ICheckboxProps, 'name'|'onBlur'|'onChange'|'defaultChecked'>, IFormInputProps<boolean> {
	sx?: Sx
}

const FormCheckboxComponent = forwardRef<HTMLInputElement, IFormCheckboxProps>((
	{
		name,
		onChange,
		onBlur,
		id,
		required,
		className,
		model,
		field = true,
		sx,
		 ...props
	},
	ref,
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<boolean>({ name, model })

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.checked)
		if(onChange) onChange(e.target.checked, form)
	}

	const handleBlur = () => {
		if(onBlur) onBlur(value, form)
	}

	return (
		<ConditionalWrapper
			wrapper={ children => (
				<Field
					type="checkbox"
					required={ required }
					errors={ !!error }
				>
					{ children }
				</Field>
			) }
			condition={ field }
		>
			<CheckboxInput
				id={ id || inputId }
				className={ className }
				name={ inputName }
				value={ name }
				checked={ value }
				onChange={ handleChange }
				onBlur={ handleBlur }
				error={ error }
				ref={ ref }
				sx={ [{ padding: '14px 10px' }, sx] }
				{ ...props }
			/>
		</ConditionalWrapper>
	)
})

export default FormCheckboxComponent
