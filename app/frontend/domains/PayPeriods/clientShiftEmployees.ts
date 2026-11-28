export type ClientPeriodEmployee = {
	id: string
	name: string
	slug: string
}

export type ClientShiftEmployeeOption = {
	value: string
	label: string
}

export function employeeOptionsFromEmployees(
	employees: ClientPeriodEmployee[],
): ClientShiftEmployeeOption[] {
	return [...employees]
		.map(employee => ({
			value: employee.id,
			label: employee.name,
		}))
		.sort((left, right) => left.label.localeCompare(right.label))
}

export function defaultEmployeeId(
	shifts: Schema.ShiftsReview[],
	options: ClientShiftEmployeeOption[],
): string | null {
	if(options.length === 0) return null

	const pendingOption = options.find(option =>
		shifts.some(shift =>
			String(shift.employee_id) === option.value && !shift.facilitator_approved_at,
		),
	)

	return pendingOption?.value ?? options[0].value
}

export function resolveSelectedEmployeeId(
	current: string | null,
	shifts: Schema.ShiftsReview[],
	options: ClientShiftEmployeeOption[],
): string | null {
	if(current && options.some(option => option.value === current)) {
		return current
	}

	return defaultEmployeeId(shifts, options)
}

export function shiftsForEmployee(
	shifts: Schema.ShiftsReview[],
	employeeId: string | null,
): Schema.ShiftsReview[] {
	if(!employeeId) return []

	return shifts.filter(shift => String(shift.employee_id) === employeeId)
}

function shiftDurationHours(shift: Schema.ShiftsReview): number {
	const startsAt = new Date(String(shift.starts_at)).getTime()
	const endsAt = new Date(String(shift.ends_at)).getTime()
	if(!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || endsAt <= startsAt) {
		return 0
	}

	return Number(((endsAt - startsAt) / (1000 * 60 * 60)).toFixed(2))
}

export function hoursForShifts(
	shifts: Schema.ShiftsReview[],
	shiftOtHours: Record<string, number>,
	shiftDoubleTimeHours: Record<string, number> = {},
): { regularHours: number, otHours: number, doubleTimeHours: number, ihssHours: number } {
	let totalHours = 0
	let otHours = 0
	let doubleTimeHours = 0
	let ihssHours = 0

	for(const shift of shifts) {
		const shiftHours = shiftDurationHours(shift)
		const shiftOt = shiftOtHours[shift.id] ?? 0
		const shiftDoubleTime = shiftDoubleTimeHours[shift.id] ?? 0

		totalHours += shiftHours
		otHours += shiftOt
		doubleTimeHours += shiftDoubleTime
		if(shift.ihss) {
			ihssHours += shiftHours
		}
	}

	const regularHours = Math.max(Number((totalHours - otHours - doubleTimeHours).toFixed(2)), 0)

	return {
		regularHours,
		otHours: Number(otHours.toFixed(2)),
		doubleTimeHours: Number(doubleTimeHours.toFixed(2)),
		ihssHours: Number(ihssHours.toFixed(2)),
	}
}
