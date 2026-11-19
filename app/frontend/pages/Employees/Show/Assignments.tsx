import { EmployeeAssignments } from "@/domains/Employees/Assignments"

import { type ShowEmployeeProps } from "."

const Assignments = ({ employee }: ShowEmployeeProps) => {
	return <EmployeeAssignments employee={ employee } />
}

export default Assignments
