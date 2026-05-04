import { type FormComponentProps, type FormComponentSlotProps, type FormDataConvertible } from "@inertiajs/core"
import { Form as InertiaForm, useFormContext } from "@inertiajs/react"
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type ReactNode } from "react"

import { Box } from "@/components"
import { renameObjectWithAttributes } from "@/lib/collections"

import {
	mergeSlotPropsWithSyntheticFallback,
	defaultNormalizeSubmitError,
	runSubmitWithIntercept,
	type NormalizeSubmitError,
	type SubmitWith,
} from "./customSubmit"
import { FormFieldProvider, useFormFieldContext } from "./FormFieldContext"
import { useSlotProps } from "./formFieldUtils"

type InertiaFormData = Record<string, FormDataConvertible>
type HTMLInputType = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const REMEMBER_PREFIX = "form:"

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value)
}

export interface FormProps<TFormData extends Record<string, unknown> = Record<string, unknown>>
	extends FormComponentProps<InertiaFormData>,
	Omit<React.FormHTMLAttributes<HTMLFormElement>, keyof FormComponentProps<InertiaFormData> | "children">,
	Omit<React.AllHTMLAttributes<HTMLFormElement>, keyof FormComponentProps<InertiaFormData> | "children"> {

	children: ReactNode
	initialData?: TFormData
	normalizeSubmitError?: NormalizeSubmitError
	railsAttributes?: boolean
	rememberKey?: string
	submitWith?: SubmitWith<TFormData>
}

function InertiaFormSlotPropsSync() {
	const inertiaForm = useFormContext()
	const { setSlotProps } = useFormFieldContext()

	useLayoutEffect(() => {
		if(inertiaForm) setSlotProps(inertiaForm)
	}, [inertiaForm, setSlotProps])

	return null
}

function loadRememberedData(key: string): Record<string, unknown> | undefined {
	try {
		const raw = localStorage.getItem(REMEMBER_PREFIX + key)
		if(!raw) return undefined
		const parsed = JSON.parse(raw)
		return isPlainObject(parsed) ? parsed : undefined
	} catch{
		return undefined
	}
}

function FormInner<TFormData extends Record<string, unknown>>({
	children,
	initialData,
	normalizeSubmitError = defaultNormalizeSubmitError,
	onBefore,
	railsAttributes = true,
	rememberKey,
	submitWith,
	transform,
	...props
}: FormProps<TFormData>) {

	const composedTransform = useMemo((): ((data: InertiaFormData) => InertiaFormData) | undefined => {
		if(!railsAttributes && !transform) return undefined

		return (data: InertiaFormData) => {
			const next = railsAttributes ? renameObjectWithAttributes(data) : data
			return transform ? transform(next) : next
		}
	}, [railsAttributes, transform])

	const wrapperRef = useRef<HTMLDivElement>(null)
	const appliedInitialDataRef = useRef(false)
	const { registerForm, handleFormChange, setSlotProps, applyInitialData, subscribeFormData } = useFormFieldContext()
	const slotProps = useSlotProps()
	const latestSlotPropsRef = useRef<FormComponentSlotProps | null>(null)
	useEffect(() => {
		latestSlotPropsRef.current = slotProps
	}, [slotProps])

	useLayoutEffect(() => {
		const form = wrapperRef.current?.querySelector("form") ?? null
		registerForm(form)

		if(!appliedInitialDataRef.current) {
			appliedInitialDataRef.current = true
			const dataToApply = rememberKey ? loadRememberedData(rememberKey) : undefined
			const data = dataToApply ?? initialData

			if(data) {
				const id = requestAnimationFrame(() => {
					const formEl = wrapperRef.current?.querySelector("form") ?? null
					if(formEl) registerForm(formEl)
					applyInitialData(data)
				})
				return () => {
					cancelAnimationFrame(id)
					registerForm(null)
					appliedInitialDataRef.current = false
				}
			}
		}

		return () => {
			registerForm(null)
			appliedInitialDataRef.current = false
		}
	}, [registerForm, initialData, rememberKey, applyInitialData])

	useEffect(() => {
		if(!rememberKey) return
		return subscribeFormData((data) => {
			try {
				localStorage.setItem(REMEMBER_PREFIX + rememberKey, JSON.stringify(data))
			} catch{
				// ignore quota / private mode
			}
		})
	}, [rememberKey, subscribeFormData])

	useEffect(() => {
		if(!rememberKey || !slotProps?.wasSuccessful) return
		try {
			localStorage.removeItem(REMEMBER_PREFIX + rememberKey)
		} catch{
			// ignore
		}
	}, [rememberKey, slotProps?.wasSuccessful])

	const handleInput = useCallback(
		(event: React.FormEvent<HTMLDivElement>) => {
			const el = event.target
			if(!(el instanceof Element)) return

			const target = el.closest<HTMLInputType>("input, select, textarea")
			if(target) handleFormChange({ target })
		},
		[handleFormChange]
	)

	const handleOnBefore = useCallback(
		(visit: Parameters<NonNullable<FormComponentProps<InertiaFormData>["onBefore"]>>[0]) => {
			const beforeResult = onBefore?.(visit)
			if(beforeResult === false) return false
			if(submitWith) {
				const payload = visit.data
				if(!(payload instanceof FormData)) {
					const base = mergeSlotPropsWithSyntheticFallback(latestSlotPropsRef.current)
					runSubmitWithIntercept(
						payload as Record<string, FormDataConvertible>,
						(data) => submitWith(data as TFormData),
						setSlotProps,
						normalizeSubmitError,
						base
					)
				}
				return false
			}
			return beforeResult
		},
		[submitWith, setSlotProps, normalizeSubmitError, onBefore]
	)

	return (
		<Box ref={ wrapperRef } onInput={ handleInput } onChange={ handleInput }>
			<InertiaForm<InertiaFormData>
				onBefore={ handleOnBefore }
				transform={ composedTransform }
				{ ...props }
			>
				<InertiaFormSlotPropsSync />
				{ children }
			</InertiaForm>
		</Box>
	)
}

function FormContextWrapper<TFormData extends Record<string, unknown>>({
	children,
	...props
}: FormProps<TFormData>) {
	return (
		<FormFieldProvider>
			<FormInner<TFormData> { ...props }>
				{ children }
			</FormInner>
		</FormFieldProvider>
	)
}

export { FormContextWrapper as Form }
