import { type MultiSelectInputProps } from "@/components/Inputs/MultiSelect"
import { type SelectInputProps } from "@/components/Inputs/Select"

export interface FormAsyncDropdown<T> extends SelectInputProps {
	initialData?: T[]
}

export interface FormAsyncMultiSelect<T> extends MultiSelectInputProps {
	initialData?: T[]
}

export interface AsyncDropdown<T> extends SelectInputProps {
	initialData?: T[]
}

export interface AsyncMultiSelect<T> extends MultiSelectInputProps {
	initialData?: T[]
}

export { CategoriesDropdown } from "./CategoriesDropdownInput"
export { CurrenciesDropdown } from "./CurrenciesDropdownInput"
export { EmployeesDropdown } from "./EmployeesDropdownInput"
export { JobTitlesDropdown } from "./JobTitlesDropdownInput"
export { LanguagesDropdown } from "./LanguagesDropdownInput"
export { PayPeriodsDropdown } from "./PayPeriodsDropdownInput"
export { TimezonesDropdown } from "./TimezonesDropdownInput"
