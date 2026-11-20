import { EmployeeHiring } from "@/domains/Employees/Hiring"

import { type ShowEmployeeProps } from "."

const Hiring = ({ employee }: ShowEmployeeProps) => {
	return <EmployeeHiring employee={ employee } />
}

export default Hiring
