import { Box } from "@mantine/core"
import clsx from "clsx"
import {
	Form as InertiaForm,
	type FormProps as UifFormProps,
	type NestedObject,
	type UseFormProps,
} from "use-inertia-form"

import { renameObjectWithAttributes } from "@/lib"

import * as classes from "./Form.css"

export type SubmitWithContext<TForm> = {
	data: TForm
	setError: (errors: Record<string, string | string[]>) => void
}

export type FormSubmitProps<TForm> = UseFormProps<TForm> & {
	setError?: (errors: Record<string, string | string[]>) => void
}

export type FormSubmitError = {
	response?: {
		data?: {
			errors?: Record<string, string | string[]>
		}
	}
}

export interface FormProps<TForm> extends Omit<UifFormProps<TForm>, "to"> {
	disableFormatting?: boolean
	submitWith?: (context: SubmitWithContext<TForm>) => void | Promise<void>
	to?: string
}

const Form = <TForm extends NestedObject>({
	children,
	data,
	className,
	railsAttributes = true,
	submitWith,
	onSuccess,
	onError,
	onSubmit,
	to,
	...props
}: FormProps<TForm>) => {

	const handleSubmit = (formProps: FormSubmitProps<TForm>) => {
		// Only proceed if passing a custom submit handler
		if(!submitWith) return onSubmit?.(formProps)

		const setError = formProps.setError ?? (() => undefined)

		const submitData = railsAttributes
			? renameObjectWithAttributes(formProps.data)
			: formProps.data

		// submitWith can return sync or Promise; normalize so we always call onSuccess once
		const run = (): Promise<void> => {
			const result = submitWith({ data: submitData, setError })
			if(result && typeof (result as Promise<unknown>).then === "function") {
				return (result as Promise<void>).then(() => onSuccess?.(formProps))
			}

			onSuccess?.(formProps)
			return Promise.resolve()
		}

		void run().catch((err: FormSubmitError) => {
			// Map API error body onto form field errors
			setError(err?.response?.data?.errors ?? {})
			onError?.(formProps)
		})

		// Return false to prevent the form from submitting as it normally would
		return false
	}

	return (
		<Box className={ clsx(classes.form) }>
			<InertiaForm
				data={ data }
				className={ clsx(className) }
				railsAttributes={ railsAttributes }
				to={ to ?? "#" }
				onSubmit={ handleSubmit }
				onSuccess={ onSuccess }
				onError={ onError }
				{ ...props }
			>
				{ children }
			</InertiaForm>
		</Box>
	)
}

export default Form
