import { useAdvancedSearch } from "./useAdvancedSearch"

export interface AdvancedInputProps {
	advancedSearch: ReturnType<typeof useAdvancedSearch>
	name: string
}

export { AdvancedSearch } from "./AdvancedSearch"
export { Type as SearchDateTypeInput } from "./Type"
export { DateRangeDate as SearchDateInput } from "./Date"
export { useAdvancedSearch }
