import { type FormMultiSelectProps } from "@/Components/Form/Inputs/MultiSelect"
import { type FormSelectProps } from "@/Components/Form/Inputs/Select"
import { type MultiSelectInputProps } from "@/Components/Inputs/MultiSelect"
import { type SelectInputProps } from "@/Components/Inputs/Select"


export interface FormAsyncDropdown<T> extends FormSelectProps {
	initialData?: T[]
}

export interface FormAsyncMultiSelect<T> extends FormMultiSelectProps {
	initialData?: T[]
}

export interface AsyncDropdown<T> extends SelectInputProps {
	initialData?: T[]
}

export interface AsyncMultiSelect<T> extends MultiSelectInputProps {
	initialData?: T[]
}

export * from "./EmployeesDropdown"
export * from "./CurrenciesDropdown"
export * from "./TimezonesDropdown"
export * from "./PayPeriodsDropdown"
export * from "./LanguagesDropdown"
