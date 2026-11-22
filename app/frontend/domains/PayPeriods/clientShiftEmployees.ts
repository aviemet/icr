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

export function shiftsForEmployee(
	shifts: Schema.ShiftsReview[],
	employeeId: string | null,
): Schema.ShiftsReview[] {
	if(!employeeId) return []

	return shifts.filter(shift => String(shift.employee_id) === employeeId)
}

export function hoursForShifts(
	shifts: Schema.ShiftsReview[],
	shiftOtHours: Record<string, number>,
): { regularHours: number, otHours: number } {
	let totalHours = 0
	let otHours = 0

	for(const shift of shifts) {
		const startsAt = new Date(String(shift.starts_at)).getTime()
		const endsAt = new Date(String(shift.ends_at)).getTime()
		const shiftHours = (endsAt - startsAt) / (1000 * 60 * 60)
		const shiftOt = shiftOtHours[shift.id] ?? 0

		totalHours += shiftHours
		otHours += shiftOt
	}

	const regularHours = Math.max(totalHours - otHours, 0)

	return { regularHours, otHours }
}
