export function nextSelectedShiftIds(
	current: string[],
	shiftId: string,
	selected: boolean,
): string[] {
	if(selected) {
		if(current.includes(shiftId)) return current
		return [...current, shiftId]
	}

	return current.filter(id => id !== shiftId)
}

export function selectedShiftIdsForToggleAll(
	shiftIds: string[],
	selected: boolean,
): string[] {
	return selected ? [...shiftIds] : []
}
