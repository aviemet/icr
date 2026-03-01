import { type FormComponentSlotProps, type FormDataConvertible } from "@inertiajs/core"
import { Form as InertiaForm } from "@inertiajs/react"
import React, { useCallback, useLayoutEffect, useMemo, useRef, type ReactNode } from "react"

import { renameObjectWithAttributes } from "@/lib/collections"

import { FormFieldProvider, useFormFieldContext } from "./FormFieldContext"

type InertiaFormProps = React.ComponentProps<typeof InertiaForm>
type HTMLInputType = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export interface FormProps extends Omit<InertiaFormProps, "children"> {
	children: ReactNode | ((props: FormComponentSlotProps) => ReactNode)
	initialData?: Record<string, unknown>
	railsAttributes?: boolean
}

function Form({
	children,
	initialData,
	railsAttributes = true,
	transform,
	...props
}: FormProps) {

	const composedTransform = useMemo((): ((data: Record<string, FormDataConvertible>) => Record<string, FormDataConvertible>) | undefined => {
		if(!railsAttributes && !transform) return undefined

		return (data: Record<string, FormDataConvertible>) => {
			const next = railsAttributes ? renameObjectWithAttributes<Record<string, FormDataConvertible>>(data) : data
			return transform ? transform(next) : next
		}
	}, [railsAttributes, transform])

	const wrapperRef = useRef<HTMLDivElement>(null)
	const appliedInitialDataRef = useRef(false)
	const { registerForm, handleFormChange, setSlotProps, applyInitialData } = useFormFieldContext()

	useLayoutEffect(() => {
		const form = wrapperRef.current?.querySelector("form") ?? null
		registerForm(form)

		if(initialData && !appliedInitialDataRef.current) {
			appliedInitialDataRef.current = true

			const id = requestAnimationFrame(() => {
				const formEl = wrapperRef.current?.querySelector("form") ?? null
				if(formEl) registerForm(formEl)
				applyInitialData(initialData)
			})

			return () => {
				cancelAnimationFrame(id)
				registerForm(null)
				appliedInitialDataRef.current = false
			}
		}

		return () => {
			registerForm(null)
			appliedInitialDataRef.current = false
		}
	}, [registerForm, initialData, applyInitialData])

	const handleInput = useCallback(
		(event: React.FormEvent<HTMLDivElement>) => {
			const el = event.target
			if(!(el instanceof Element)) return

			const target = el.closest<HTMLInputType>("input, select, textarea")
			if(target) handleFormChange({ target })
		},
		[handleFormChange]
	)

	const renderChildren = useCallback(
		(slotProps: FormComponentSlotProps) => {
			queueMicrotask(() => setSlotProps(slotProps))
			return typeof children === "function" ? children(slotProps) : children
		},
		[children, setSlotProps]
	)

	return (
		<div ref={ wrapperRef } onInput={ handleInput } onChange={ handleInput }>
			<InertiaForm { ...props } transform={ composedTransform }>{ renderChildren }</InertiaForm>
		</div>
	)
}

function FormContextWrapper({ children, ...props }: FormProps) {
	return (
		<FormFieldProvider>
			<Form { ...props }>
				{ children }
			</Form>
		</FormFieldProvider>
	)
}


export { FormContextWrapper as Form }
