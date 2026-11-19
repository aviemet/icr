interface DueDateLabelKeys {
	dueInDays: string
	overdueByDays: string
}

export function payrollDueDateLabel(
	dueInDays: number,
	translate: (key: string, options: { count: number }) => string,
	keys: DueDateLabelKeys,
) {
	if(dueInDays < 0) {
		return translate(keys.overdueByDays, { count: Math.abs(dueInDays) })
	}

	return translate(keys.dueInDays, { count: dueInDays })
}
