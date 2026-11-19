import { EmployeeContacts } from "@/domains/Employees/Contacts"

import { type ShowEmployeeProps } from "."

const Contacts = ({ employee }: ShowEmployeeProps) => {
	return <EmployeeContacts employee={ employee } />
}

export default Contacts
