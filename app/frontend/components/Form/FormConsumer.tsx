import React, { useEffect, useRef } from "react"

import { useFormFieldContext } from "./FormFieldContext"
import { type FormConsumerState } from "./FormFieldContext"

interface FormConsumerProps {
	children?: (state: FormConsumerState) => React.ReactNode
	onChange?: (state: FormConsumerState) => void
}

export function FormConsumer({ children, onChange }: FormConsumerProps) {
	const { getFormData, slotProps, subscribeFormData } = useFormFieldContext()
	const stateRef = useRef<FormConsumerState>({ getFormData, slotProps })

	useEffect(() => {
		stateRef.current = { getFormData, slotProps }
	}, [getFormData, slotProps])

	useEffect(() => {
		if(!onChange) return

		return subscribeFormData(() => {
			onChange(stateRef.current)
		})
	}, [subscribeFormData, onChange])

	const state: FormConsumerState = { getFormData, slotProps }

	return <>{ children ? children(state) : null }</>
}
