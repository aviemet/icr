type TablePreferences = {
	[model: string]: {
		hide?: Record<string, boolean>
		limit?: string | number
	} | undefined
}

export default TablePreferences
