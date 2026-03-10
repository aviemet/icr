import { useAdvancedSearch } from "../useAdvancedSearch"

export interface AdvancedInputProps {
	advancedSearch: ReturnType<typeof useAdvancedSearch>
	name: string
}

export { Type as SearchDateTypeInput } from "./Type"
export { SearchDateInput } from "./SearchDateInput"
