import { EmployeePay } from "@/domains/Employees/Pay"

import { type ShowEmployeeProps } from "."

const Pay = ({ employee }: ShowEmployeeProps) => {
	return <EmployeePay employee={ employee } />
}

export default Pay
