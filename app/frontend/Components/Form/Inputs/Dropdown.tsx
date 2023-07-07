import React, { forwardRef } from 'react'
import Field from '../Field'
import DropdownInput, { type IDropdownProps } from '@/Components/Inputs/Dropdown'
import { ConditionalWrapper } from '@/Components'
import { useInertiaInput, type UseFormProps } from 'use-inertia-form'
import { type IFormInputProps } from '.'

type OmittedDropdownTypes = 'name'|'defaultValue'|'onBlur'|'onChange'|'onDropdownOpen'|'onDropdownClose'
export interface DropdownFormProps extends Omit<IDropdownProps, OmittedDropdownTypes>, IFormInputProps<string> {
	defaultValue?: string
	onChange?: ((value: string|null, form: UseFormProps<unknown>) => void) | undefined
	onDropdownOpen?: (form: UseFormProps<any>) => void
	onDropdownClose?: (form: UseFormProps<any>) => void
	endpoint?: string
	field?: boolean
}

export interface AsyncDropdownProps<T> extends Omit<DropdownFormProps, 'filter'> {
	filter?: (employee: T) => boolean
}

const Dropdown = forwardRef<HTMLInputElement, DropdownFormProps>((
	{
		name,
		label,
		model,
		required,
		defaultValue,
		onSearchChange,
		onChange,
		onBlur,
		onDropdownOpen,
		onDropdownClose,
		fetchOnOpen,
		endpoint,
		field = true,
		id,
		errorKey,
		options,
		...props
	},
	ref,
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput({ name, model, errorKey })

	const handleChange = (option: string|null) => {
		setValue(option ? option : '')

		if(onChange) onChange(option, form)
	}

	const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
		if(onBlur) onBlur(String(value), form)
	}

	const handleDropdownOpen = () => {
		if(onDropdownOpen) onDropdownOpen(form)
	}

	const handleDropdownClose = () => {
		if(onDropdownClose) onDropdownClose(form)
	}

	return (
		<ConditionalWrapper
			wrapper={ children => (
				<Field
					type="select"
					required={ required }
					errors={ !!error }
				>
					{ children }
				</Field>
			) }
			condition={ field }
		>
			<DropdownInput
				ref={ ref }
				id={ id || inputId }
				name={ inputName }
				label={ label }
				value={ String(value) }
				onChange={ handleChange }
				onBlur={ handleBlur }
				onDropdownClose={ handleDropdownClose }
				onDropdownOpen={ handleDropdownOpen }
				defaultValue={ defaultValue ?? String(value) }
				error={ error }
				options={ options }
				{ ...props }
			/>
		</ConditionalWrapper>
	)
})

export default Dropdown
