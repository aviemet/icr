import { type FormComponentSlotProps, type FormDataConvertible } from "@inertiajs/core"

export type SubmitWith<T = Record<string, FormDataConvertible>> = (data: T) => Promise<unknown>

export type NormalizeSubmitError = (error: unknown) => Record<string, string>

const NOOP = () => {}
const NOOP_TRUE = () => true
const NOOP_FALSE = () => false
const NOOP_GET_DATA = (): Record<string, FormDataConvertible> => ({})
const NOOP_GET_FORM_DATA = (): FormData => new FormData()

type SlotValidator = ReturnType<FormComponentSlotProps["validator"]>

function createNoopValidator(): SlotValidator {
	const validator: SlotValidator = {
		touched: () => [],
		validate: () => validator,
		touch: () => validator,
		validating: () => false,
		valid: () => [],
		errors: () => ({}),
		setErrors: () => validator,
		hasErrors: () => false,
		forgetError: () => validator,
		reset: () => validator,
		setTimeout: () => validator,
		on: () => validator,
		validateFiles: () => validator,
		withoutFileValidation: () => validator,
		defaults: () => validator,
	}

	return validator
}

const NOOP_VALIDATOR = (): SlotValidator => createNoopValidator()

const NOOP_SET_ERROR: FormComponentSlotProps["setError"] = () => {}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value)
}

function stringErrorsFrom(value: unknown): Record<string, string> | undefined {
	if(!isRecord(value)) {
		return undefined
	}

	const errors: Record<string, string> = {}
	for(const [key, entry] of Object.entries(value)) {
		if(typeof entry === "string") {
			errors[key] = entry
		}
	}

	if(Object.keys(errors).length === 0) {
		return undefined
	}

	return errors
}

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
		setError: NOOP_SET_ERROR,
		reset: NOOP,
		submit: NOOP,
		cancel: NOOP,
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

export function mergeSlotPropsWithSyntheticFallback(
	live: FormComponentSlotProps | null
): FormComponentSlotProps {
	if(!live) return createInitialSyntheticSlotProps()
	return { ...createInitialSyntheticSlotProps(), ...live }
}

export function defaultNormalizeSubmitError(error: unknown): Record<string, string> {
	if(!isRecord(error)) {
		return {}
	}

	const response = error.response
	if(isRecord(response)) {
		const data = response.data
		if(isRecord(data)) {
			const fromResponse = stringErrorsFrom(data.errors)
			if(fromResponse !== undefined) {
				return fromResponse
			}
		}
	}

	const fromError = stringErrorsFrom(error.errors)
	if(fromError !== undefined) {
		return fromError
	}

	return {}
}

export function runSubmitWithIntercept(
	data: Record<string, FormDataConvertible>,
	submitWith: SubmitWith<Record<string, FormDataConvertible>>,
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
		.catch((caughtError: unknown) => {
			const errors = normalizeSubmitError(caughtError)
			setSlotProps({
				...base,
				processing: false,
				errors,
				hasErrors: Object.keys(errors).length > 0,
			})
		})
}
