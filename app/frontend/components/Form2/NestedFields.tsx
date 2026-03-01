import { type ReactNode } from "react"

import { FormContextProvider, useFormContext } from "./FormContext"

export interface NestedFieldsProps {
	children: ReactNode
	model: string
}

export function NestedFields({ children, model }: NestedFieldsProps) {
	const parentPath = useFormContext(false)

	let inputModel = model

	if(parentPath) {
		if(model.charAt(0) === "[") {
			inputModel = `${parentPath}${model}`
		} else {
			inputModel = `${parentPath}.${model}`
		}
	}

	return (
		<FormContextProvider value={ inputModel }>
			{ children }
		</FormContextProvider>
	)
}
