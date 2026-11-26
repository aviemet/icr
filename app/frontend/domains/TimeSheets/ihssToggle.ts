export interface IhssToggleDelta {
	id: string
	ihss: boolean
	shift_ot_hours: Record<string, number>
	employee_hours?: {
		regular_hours?: number
		ot_hours?: number
		ihss_hours?: number
		company_hours?: number
		pto_hours?: number
		sick_hours?: number
		holiday_hours?: number
	}
	ihss_hours_used?: number
}

export function applyIhssToggleToShifts(
	shifts: Schema.ShiftsReview[],
	delta: IhssToggleDelta,
): Schema.ShiftsReview[] {
	return shifts.map(row => (
		row.id === delta.id
			? { ...row, ihss: delta.ihss }
			: row
	))
}

export function mergeShiftOtHours(
	current: Record<string, number>,
	delta: Record<string, number>,
): Record<string, number> {
	return { ...current, ...delta }
}
