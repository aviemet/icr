import { EmployeeOverview } from "@/domains/Employees/Overview"

import { type ShowEmployeeProps } from "."

const Overview = ({ employee }: ShowEmployeeProps) => {
	return <EmployeeOverview employee={ employee } />
}

export default Overview
