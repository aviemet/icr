import { EmployeeProfileForm } from "./Form"

interface EmployeeProfileProps {
	employee: Schema.EmployeesShow
}

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
	return <EmployeeProfileForm employee={ employee } />
}
