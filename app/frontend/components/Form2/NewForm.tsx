import { formDataToObject, type FormComponentSlotProps, type FormDataConvertible } from "@inertiajs/core"
import { Form as InertiaForm } from "@inertiajs/react"
import { Box } from "@mantine/core"
import { type UseMutationResult } from "@tanstack/react-query"
import clsx from "clsx"
import { useCallback, useEffect, useRef, type ReactNode } from "react"

import { isPlainObject, mergeRefs } from "@/lib"

import * as classes from "./Form.css"
import { FormContextProvider } from "./FormContext"

type InertiaFormProps = React.ComponentProps<typeof InertiaForm>

function transformRailsAttributesRecursive(
	data: Record<string, FormDataConvertible>,
	suffix = "_attributes"
): Record<string, FormDataConvertible> {
	const transformed: Record<string, FormDataConvertible> = {}

	for(const [key, value] of Object.entries(data)) {
		if(Array.isArray(value)) {
			transformed[`${key}${suffix}`] = value
		} else if(isPlainObject<FormDataConvertible>(value)) {
			transformed[`${key}${suffix}`] = transformRailsAttributesRecursive(value, suffix)
		} else {
			transformed[key] = value
		}
	}

	return transformed
}

export interface FormProps<TData extends Record<string, FormDataConvertible> = Record<string, FormDataConvertible>>
	extends Omit<InertiaFormProps, "children"> {
	model?: string
	railsAttributes?: boolean | string
	mutation?: UseMutationResult<unknown, Error, TData, unknown>
	children?: ReactNode | ((props: FormComponentSlotProps) => ReactNode)
}

export function Form<TData extends Record<string, FormDataConvertible> = Record<string, FormDataConvertible>>({
	model,
	railsAttributes = true,
	mutation,
	children,
	transform: userTransform,
	onSubmit,
	onSuccess,
	onError,
	onChange,
	ref,
	...props
}: FormProps<TData>) {
	const handleTransform = useCallback((data: Record<string, FormDataConvertible>): Record<string, FormDataConvertible> => {

		let transformed = data

		if(railsAttributes) {
			const suffix = typeof railsAttributes === "string" ? railsAttributes : "_attributes"
			const result: Record<string, FormDataConvertible> = {}
			for(const [key, value] of Object.entries(transformed)) {
				if(isPlainObject<FormDataConvertible>(value)) {
					result[key] = transformRailsAttributesRecursive(value, suffix)
				} else {
					result[key] = value
				}
			}
			transformed = result
		}

		if(userTransform) {
			transformed = userTransform(transformed)
		}

		return transformed
	}, [railsAttributes, userTransform])

	const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
		if(!mutation) return

		e.preventDefault()

		const formData = new FormData(e.currentTarget)
		const data = formDataToObject(formData)
		const transformed = handleTransform(data)

		mutation.mutate(transformed as TData, {
			onSuccess: (result) => {
				onSuccess?.(result as Parameters<NonNullable<typeof onSuccess>>[0])
			},
			onError: (error) => {
				onError?.(error as unknown as Parameters<NonNullable<typeof onError>>[0])
			},
		})
	}, [mutation, handleTransform, onSuccess, onError])

	const contextValue = model || null

	return (
		<Box className={ clsx(classes.form) }>
			<FormContextProvider value={ contextValue }>
				<InertiaForm
					ref={ ref }
					transform={ handleTransform }
					onSubmit={ mutation ? handleSubmit : onSubmit }
					onSuccess={ onSuccess }
					onError={ onError }
					{ ...props }
				>
					{ children }
				</InertiaForm>
			</FormContextProvider>
		</Box>
	)
}
