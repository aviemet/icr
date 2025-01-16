import { forwardRef, type ForwardedRef } from 'react'
import { useInertiaInput, type NestedObject } from 'use-inertia-form'
import Field from '../Components/Field'
import TextareaInput, { type TextareaProps } from '@/Components/Inputs/Textarea'
import ConditionalWrapper from '@/Components/ConditionalWrapper'
import { InputConflicts, type BaseFormInputProps } from '.'

import cx from 'clsx'

interface FormTextareaProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<TextareaProps, InputConflicts>,
	BaseFormInputProps<string, TForm> {}

const Textarea = forwardRef(<TForm extends NestedObject = NestedObject>(
	{
		label,
		name,
		required,
		onChange,
		onBlur,
		onFocus,
		id,
		model,
		field = true,
		wrapperProps,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
		...props
	}: FormTextareaProps<TForm>,
	ref: ForwardedRef<HTMLTextAreaElement>
) => {
	const { form, inputName, inputId, value, setValue, error } = useInertiaInput<string, TForm>({
		name,
		model,
		errorKey,
		defaultValue,
		clearErrorsOnChange,
	})

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setValue(e.target.value)
		onChange?.(e.target.value, form)
	}
	const handleBlur = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		if(onBlur) onBlur(e.target.value, form)
	}

	return (
		<ConditionalWrapper
			condition={ props.hidden !== true && field }
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
				<TextareaInput
					ref={ ref }
					id={ id || inputId }
					name={ inputName }
					onChange={ handleChange }
					onBlur={ handleBlur }
					onFocus={ e => onFocus?.(e.target.value, form) }
					value={ value }
					required={ required }
					error={ errorKey ? form.getError(errorKey) : error }
					wrapper={ false }
					{ ...props }
				>
				</TextareaInput>
			</>
		</ConditionalWrapper>
	)
})

export default Textarea
