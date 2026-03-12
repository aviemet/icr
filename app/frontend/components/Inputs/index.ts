import { type DateValue, type DatesRangeValue } from "@mantine/dates"

export { AutocompleteInput, type AutocompleteProps } from "./AutocompleteInput"
export { Checkbox, type CheckboxProps } from "./Checkbox"
export { ColorPickerInput, type ColorPickerInputProps } from "./ColorPickerInput"
export { CurrencyInput, type CurrencyInputProps } from "./CurrencyInput"
export { DateInput, type DateInputProps } from "./DateInput"
export { DateTimeInput, type DateTimeProps } from "./DateTimeInput"
export { HiddenInput } from "./HiddenInput"
export { MultiSelect, type MultiSelectInputProps } from "./MultiSelect"
export { NumberInput, type NumberInputProps } from "./NumberInput"
export { PasswordInput, type PasswordInputProps } from "./PasswordInput"
export { SegmentedControl, type SegmentedControlProps } from "./SegmentedControl"
export { RichText, type RichTextInputProps } from "./RichText"
export { Select, type SelectInputProps } from "./Select"
export { SwatchInput, type SwatchInputProps } from "./SwatchInput"
export { Switch, type SwitchProps } from "./Switch"
export { Textarea, type TextareaProps } from "./Textarea"
export { TextInput, type TextInputProps } from "./TextInput"
export { TimeInput, type TimeInputProps } from "./TimeInput"
export { SplitDateTimeInput } from "./SplitDateTimeInput"

export interface BaseInputProps {
	wrapper?: boolean
	disableAutofill?: boolean
	name?: string
	required?: boolean
}

export type DateInputValue = DateValue | DatesRangeValue | string[] | undefined

const disableAutofillProps = {
	autoComplete: "off",
	"data-1p-ignore": true,
	"data-bwignore": true,
	"data-lpignore": true,
	"data-form-type": "other",
}

type withInjectedPropsFunc = (
	props: Record<string, unknown>,
	options: {
		disableAutofill?: boolean
	}
) => Record<string, unknown>

export const withInjectedProps: withInjectedPropsFunc = (props, { disableAutofill }) => {
	const usedProps = props ?? {}

	if(disableAutofill) {
		Object.assign(usedProps, disableAutofillProps)
	}

	return usedProps
}
