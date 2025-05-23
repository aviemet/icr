import { type MultiSelectInputProps } from "../Inputs/MultiSelect"
import { type SelectInputProps } from "../Inputs/Select"

// export { default as AssetsDropdown }        from './AssetsDropdown'
// export { default as CategoriesDropdown }    from './CategoriesDropdown'
// export { default as CurrenciesDropdown }    from './CurrenciesDropdown'
// export { default as DepartmentsDropdown }   from './DepartmentsDropdown'
// export { default as ItemsDropdown }         from './ItemsDropdown'
// export { default as LocationsDropdown }     from './LocationsDropdown'
// export { default as ManufacturersDropdown } from './ManufacturersDropdown'
// export { default as ModelsDropdown }        from './ModelsDropdown'
// export { default as PeopleDropdown }        from './PeopleDropdown'
// export { default as PeopleMultiSelect }     from './PeopleMultiSelect'
// export { default as StatusLabelsDropdown }  from './StatusLabelsDropdown'
// export { default as VendorsDropdown }       from './VendorsDropdown'

export interface IAsyncDropdown<T> extends Omit<SelectInputProps, "defaultValue" | "onBlur"> {
	name?: string
	model?: string
	label?: string
	fetchOnOpen?: string
	required?: boolean
	errorKey?: string
	initialData?: T[]
}

export interface IAsyncMultiSelect<T> extends Omit<MultiSelectInputProps, "onBlur"> {
	errorKey?: string
	initialData?: T[]
}
