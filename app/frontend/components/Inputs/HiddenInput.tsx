import React from "react"
import { InputProps } from "react-html-props"

interface HiddenInputProps extends InputProps {
	ref?: React.Ref<HTMLInputElement>
}

const TextInputComponent = ({ name, id, ref, ...props }: HiddenInputProps) => {
	const inputId = id || name

	return (
		<input
			ref={ ref }
			name={ name }
			id={ inputId }
			type="hidden"
			{ ...props }
		/>
	)
}

export default TextInputComponent
