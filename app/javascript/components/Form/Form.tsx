import React, { forwardRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { FormProps } from 'react-html-props'
import Input from 'components/Input/Input'

interface ThisFormProps extends FormProps {
	onSubmit?: () => void
}

interface FormComponent extends React.FunctionComponent{
	Input: typeof Input
}

const Form: FormComponent = (
	{ children, onSubmit = () => {}, ...props }: ThisFormProps
) => {
	const { register, handleSubmit, watch, formState: { errors } } = useForm()

	return (
		<form onSubmit={ handleSubmit(onSubmit) } { ...props }>
			{ children }
		</form>
	)
}

Form.Input = Input

export default Form


// React.ForwardRefRenderFunction<HTMLFormElement, ThisFormProps>