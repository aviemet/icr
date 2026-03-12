import { type FormComponentSlotProps, formDataToObject } from "@inertiajs/core"
import { isEqual, pick } from "lodash-es"
import React, { useRef, useState } from "react"

import { flattenToPaths } from "@/lib"
import { createContext } from "@/lib/hooks"

import {
	getFormValueByName,
	getInputValue,
	nameToPath,
	setFormValue as setFormValueUtil,
} from "./formFieldUtils"

export type FormConsumerState = {
	getFormData: () => Record<string, unknown>
	slotProps: FormComponentSlotProps | null
}

export interface FormFieldContextValue {
	subscribe: (path: string, callback: (value: unknown) => void) => () => void
	subscribeFormData: (callback: (data: Record<string, unknown>) => void) => () => void
	getValue: (path: string) => unknown
	setValue: (path: string, value: unknown) => void
	getFormData: () => Record<string, unknown>
	clearPathsStartingWith: (prefix: string) => void
	registerForm: (form: HTMLFormElement | null) => void
	applyInitialData: (data: Record<string, unknown>) => void
	handleFormChange: (event: { target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement }) => void
	slotProps: FormComponentSlotProps | null
	setSlotProps: (props: FormComponentSlotProps | null) => void
}

const [useFormFieldContext, FormFieldContextProvider] = createContext<FormFieldContextValue>()
export { useFormFieldContext }

const SLOT_STATE_KEYS: (keyof FormComponentSlotProps)[] = [
	"errors",
	"hasErrors",
	"processing",
	"progress",
	"wasSuccessful",
	"recentlySuccessful",
	"isDirty",
	"validating",
]

function slotStateEqual(
	a: FormComponentSlotProps | null,
	b: FormComponentSlotProps | null
): boolean {
	if(a === b) return true
	if(a === null || b === null) return false
	return isEqual(pick(a, SLOT_STATE_KEYS), pick(b, SLOT_STATE_KEYS))
}

export function FormFieldProvider({ children }: { children: React.ReactNode }) {
	const storeRef = useRef<Record<string, unknown>>({})
	const subscriptionsRef = useRef<Map<string, Set<(value: unknown) => void>>>(new Map())
	const formDataSubscriptionsRef = useRef<Set<(data: Record<string, unknown>) => void>>(new Set())
	const formRef = useRef<HTMLFormElement | null>(null)
	const slotPropsRef = useRef<FormComponentSlotProps | null>(null)
	const [slotProps, setSlotPropsState] = useState<FormComponentSlotProps | null>(null)

	const [api] = useState(() => {
		const apiImpl = {
			registerForm(form: HTMLFormElement | null) {
				formRef.current = form
			},

			getValue(path: string) {
				if(Object.prototype.hasOwnProperty.call(storeRef.current, path)) {
					return storeRef.current[path]
				}

				const form = formRef.current
				if(!form) return undefined

				const val = getFormValueByName(form, path)
				storeRef.current[path] = val

				return val
			},

			setValue(path: string, val: unknown) {
				storeRef.current[path] = val
				const form = formRef.current

				if(form) setFormValueUtil(form, path, val)

				subscriptionsRef.current.get(path)?.forEach(cb => cb(val))
			},

			applyInitialData(data: Record<string, unknown>) {
				flattenToPaths(data).forEach(([path, val]) => apiImpl.setValue(path, val))
			},

			getFormData() {
				const form = formRef.current

				if(!form) return {}

				return formDataToObject(new FormData(form)) as Record<string, unknown>
			},

			clearPathsStartingWith(prefix: string) {
				const dotPrefix = prefix + "."
				for(const path of Object.keys(storeRef.current)) {
					if(path.startsWith(dotPrefix)) delete storeRef.current[path]
				}
			},

			subscribe(path: string, callback: (value: unknown) => void) {
				let set = subscriptionsRef.current.get(path)
				if(!set) {
					set = new Set()
					subscriptionsRef.current.set(path, set)
				}
				set.add(callback)

				return () => {
					set?.delete(callback)
					if(set?.size === 0) subscriptionsRef.current.delete(path)
				}
			},

			subscribeFormData(callback: (data: Record<string, unknown>) => void) {
				formDataSubscriptionsRef.current.add(callback)
				return () => {
					formDataSubscriptionsRef.current.delete(callback)
				}
			},

			handleFormChange(event: { target: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement }) {
				const input = event.target
				const name = input.getAttribute("name")
				const form = input.form

				if(!name || !form) return

				formRef.current = form
				const path = nameToPath(name)
				const val = getInputValue(input)

				storeRef.current[path] = val
				subscriptionsRef.current.get(path)?.forEach(cb => cb(val))
				const formData = apiImpl.getFormData()
				formDataSubscriptionsRef.current.forEach(cb => cb(formData))
			},
		}

		return apiImpl
	})

	const setSlotProps = (newProps: FormComponentSlotProps | null) => {
		if(!slotStateEqual(newProps, slotPropsRef.current)) {
			slotPropsRef.current = newProps
			setSlotPropsState(newProps)
		}
	}

	const value: FormFieldContextValue = { ...api, slotProps, setSlotProps }

	return (
		<FormFieldContextProvider value={ value }>
			{ children }
		</FormFieldContextProvider>
	)
}
