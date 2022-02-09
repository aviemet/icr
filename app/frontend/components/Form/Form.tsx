import React, { useContext, useEffect } from 'react'
import { useForm as useInertiaForm, InertiaFormProps } from '@inertiajs/inertia-react'

import { FormProps } from 'react-html-props'

const FormContext = React.createContext<InertiaFormProps<Record<string, any>>|null>(null)

export const useForm = () => useContext(FormContext)

interface IFormProps extends FormProps {
	data: Record<string, string>
	to: string
	onSubmit?: (object) => boolean|void
}

const Form = ({ children, data, method = 'post', to, onSubmit, ...props }: IFormProps) => {
	const form = useInertiaForm(data)

	const handleSubmit = e => {
		e.preventDefault()
		let submit = true
		if(onSubmit) {
			const val = onSubmit(form)
			if(val === true || val === false) submit = val
		}
		if(submit) form[method.toLocaleLowerCase()](to)
	}

	return (
		<FormContext.Provider value={ form }>
			<form onSubmit={ handleSubmit } { ...props }>
				{ children }
			</form>
		</FormContext.Provider>
	)
}

export default React.memo(Form)
