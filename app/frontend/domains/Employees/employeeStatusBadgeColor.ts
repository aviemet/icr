export function employeeStatusBadgeColor(status: Schema.EmployeesIndex["status"]) {
	if(status === "employed") return "green"
	if(status === "terminated") return "red"
	if(status === "offered") return "cyan"
	if(status === "applicant") return "blue"
	return "gray"
}
