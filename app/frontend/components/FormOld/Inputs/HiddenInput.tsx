import { InputProps } from "react-html-props"
import { NestedObject, useInertiaInput } from "use-inertia-form"

import { HiddenInput as BaseHiddenInput } from "@/components/Inputs"

import { type InputConflicts, type BaseFormInputProps } from "."

type OmittedHiddenInputProps = "onBlur" | "onFocus" | "wrapperProps" | "ref"
export interface FormHiddenInputProps<TForm extends NestedObject = NestedObject>
	extends
	Omit<InputProps, InputConflicts | OmittedHiddenInputProps>,
	Omit<BaseFormInputProps<string, TForm>, "span" | OmittedHiddenInputProps> {
	ref?: React.Ref<HTMLInputElement>
}

export function HiddenInput<TForm extends NestedObject = NestedObject>(
	{ name, model, onChange, id, defaultValue, ref, ...props }: FormHiddenInputProps<TForm>,
) {
	const { form, inputName, inputId, value, setValue } = useInertiaInput<string, TForm>({
		name,
		model,
		defaultValue,
	})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setValue(value)

		onChange?.(value, form)
	}

	return (
		<BaseHiddenInput
			ref={ ref }
			id={ id || inputId }
			name={ inputName }
			value={ value }
			onChange={ handleChange }
			{ ...props }
		/>
	)
}
