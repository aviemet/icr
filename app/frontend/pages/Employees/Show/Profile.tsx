import { EmployeeProfile } from "@/domains/Employees/Profile"

import { type ShowEmployeeProps } from "."

const Profile = ({ employee }: ShowEmployeeProps) => {
	return <EmployeeProfile employee={ employee } />
}

export default Profile
