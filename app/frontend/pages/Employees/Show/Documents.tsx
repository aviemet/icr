import { EmployeeDocuments } from "@/domains/Employees/Documents"

import { type ShowEmployeeProps } from "."

const Documents = ({ employee }: ShowEmployeeProps) => {
	return <EmployeeDocuments employee={ employee } />
}

export default Documents
