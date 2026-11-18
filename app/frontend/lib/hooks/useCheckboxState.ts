export function useCheckboxState(length: number, selected: number) {
	if(length === 0) {
		return { allChecked: false, indeterminate: false }
	}

	const allChecked = selected === length
	const indeterminate = selected > 0 && selected < length

	return { allChecked, indeterminate }
}
