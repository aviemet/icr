import { EmployeeCredentials } from "@/domains/Employees/Credentials"

import { type ShowEmployeeProps } from "."

const Credentials = ({ employee }: ShowEmployeeProps) => {
	return <EmployeeCredentials employee={ employee } />
}

export default Credentials
