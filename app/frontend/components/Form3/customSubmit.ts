import { type FormComponentSlotProps, type FormDataConvertible } from "@inertiajs/core"

export type SubmitWith = (data: Record<string, FormDataConvertible>) => Promise<unknown>

export type NormalizeSubmitError = (error: unknown) => Record<string, string>

const NOOP = () => {}
const NOOP_TRUE = () => true
const NOOP_FALSE = () => false
const NOOP_GET_DATA = (): Record<string, FormDataConvertible> => ({})
const NOOP_GET_FORM_DATA = (): FormData => new FormData()
const NOOP_VALIDATOR = () => ({}) as ReturnType<FormComponentSlotProps["validator"]>

export function createInitialSyntheticSlotProps(): FormComponentSlotProps {
	return {
		errors: {},
		hasErrors: false,
		processing: false,
		progress: null,
		wasSuccessful: false,
		recentlySuccessful: false,
		isDirty: false,
		validating: false,
		clearErrors: NOOP,
		resetAndClearErrors: NOOP,
		setError: NOOP as FormComponentSlotProps["setError"],
		reset: NOOP,
		submit: NOOP,
		defaults: NOOP,
		getData: NOOP_GET_DATA,
		getFormData: NOOP_GET_FORM_DATA,
		valid: NOOP_TRUE,
		invalid: NOOP_FALSE,
		validate: NOOP,
		touch: NOOP,
		touched: NOOP_FALSE,
		validator: NOOP_VALIDATOR,
	}
}

type ErrorWithPossibleErrors = {
	response?: { data?: { errors?: Record<string, string> } }
	errors?: Record<string, string>
}

export function defaultNormalizeSubmitError(error: unknown): Record<string, string> {
	if(error !== null && typeof error === "object") {
		const err = error as ErrorWithPossibleErrors
		const fromResponse = err.response?.data?.errors

		if(fromResponse && typeof fromResponse === "object") return fromResponse
		if(err.errors && typeof err.errors === "object") return err.errors
	}
	return {}
}

export function runSubmitWithIntercept(
	data: Record<string, FormDataConvertible>,
	submitWith: SubmitWith,
	setSlotProps: (props: FormComponentSlotProps | null) => void,
	normalizeSubmitError: NormalizeSubmitError,
	base: FormComponentSlotProps
) {
	setSlotProps({ ...base, processing: true, errors: {}, hasErrors: false })
	submitWith(data)
		.then(() => {
			setSlotProps({
				...base,
				processing: false,
				wasSuccessful: true,
				recentlySuccessful: true,
				errors: {},
				hasErrors: false,
			})
		})
		.catch((error: unknown) => {
			const errors = normalizeSubmitError(error)
			setSlotProps({
				...base,
				processing: false,
				errors,
				hasErrors: Object.keys(errors).length > 0,
			})
		})
}
