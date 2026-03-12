import { NestedObject, UseFormProps, UseInertiaInputProps } from "use-inertia-form"

export { Autocomplete, type FormAutocompleteProps } from "./Autocomplete"
export { CurrencyInput, type FormCurrencyInputProps } from "./CurrencyInput"
export { DateInput, type FormDateInputProps } from "./DateInput"
export { DateTimeInput, type FormDateTimeInputProps } from "./DateTimeInput"
export { HiddenInput, type FormHiddenInputProps } from "./HiddenInput"
export { MultiSelect, type FormMultiSelectProps } from "./MultiSelect"
export { NumberInput, type FormNumberInputProps } from "./NumberInput"
export { PasswordInput, type FormPasswordInputProps } from "./PasswordInput"
export { SegmentedControl, type FormSegmentedControlProps } from "./SegmentedControl"
export { RichText, type FormRichTextInputProps } from "./RichText"
export { Select, type FormSelectProps } from "./Select"
export { SplitDateTimeInput } from "./SplitDateTimeInput"
export { SwatchInput, type FormSwatchInputProps } from "./SwatchInput"
export { Switch, type FormSwitchProps } from "./Switch"
export { TextInput, type FormTextInputProps } from "./TextInput"
export { Textarea } from "./Textarea"
export { TimeInput, type FormTimeInputProps } from "./TimeInput"
export { CheckboxInput } from "./Checkbox/Checkbox"
export { CheckboxGroup } from "./Checkbox/Group"

export type InputConflicts = "name" | "onChange" | "onBlur" | "onFocus" | "value" | "defaultValue"
export interface BaseFormInputProps<T, TForm extends NestedObject = NestedObject>
	extends UseInertiaInputProps<T> {
	model?: string
	errorKey?: string
	field?: boolean
	required?: boolean
	hidden?: boolean
	onChange?: (value: T, form: UseFormProps<TForm>) => void
	onBlur?: (value: T, form: UseFormProps<TForm>) => void
	onFocus?: (value: T, form: UseFormProps<TForm>) => void
}
