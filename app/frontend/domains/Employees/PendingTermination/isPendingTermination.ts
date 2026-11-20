import dayjs from "dayjs"

export function isPendingTermination(employee: {
	status?: string
	inactive_at?: Date | string | null
}): boolean {
	if(employee.status !== "employed") return false
	if(employee.inactive_at === undefined || employee.inactive_at === null || employee.inactive_at === "") {
		return false
	}

	return dayjs(employee.inactive_at).isAfter(dayjs())
}
