import { forwardRef, type ForwardedRef } from 'react'
import { NestedObject, useInertiaInput } from 'use-inertia-form'
import Field from '../Components/Field'
import RichTextInput, { type RichTextInputProps } from '@/Components/Inputs/RichText'
import ConditionalWrapper from '@/Components/ConditionalWrapper'
import { type InputConflicts, type BaseFormInputProps } from '.'

import cx from 'clsx'

interface FormRichTextInputProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<RichTextInputProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {}

const RichText = forwardRef(<TForm extends NestedObject = NestedObject>(
	{
		label,
		name,
		required = false,
		id,
		onChange,
		onBlur,
		onFocus,
		model,
		field = true,
		wrapperProps,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
		...props
	}: FormRichTextInputProps<TForm>,
	ref: ForwardedRef<HTMLInputElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (v: string) => {
		setValue(v)
		onChange?.(v, form)
	}

	const handleBlur = () => {
		onBlur?.(value, form )
	}

	return (
		<ConditionalWrapper
			condition={ field }
			wrapper={ children => (
				<Field
					type="textarea"
					required={ required }
					errors={ !!error }
					{ ...wrapperProps }
				>
					{ children }
				</Field>
			) }
		>
			<>
				{ label && <label className={ cx({ required }) } htmlFor={ id || inputId }>
					{ label }
				</label> }
				<RichTextInput
					ref={ ref }
					id={ id }
					name={ inputName }
					onChange={ handleChange }
					onBlur={ handleBlur }
					onFocus={ () => onFocus?.(value, form ) }
					value={ value }
					wrapper={ false }
					{ ...props }
				/>
			</>
		</ConditionalWrapper>
	)
})

export default RichText
