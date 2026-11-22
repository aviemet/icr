import { EmployeeOverview } from "@/domains/Employees/Overview"

import { type ShowEmployeeProps } from "."

const Overview = ({ employee, requirement_fulfillments }: ShowEmployeeProps) => {
	return (
		<EmployeeOverview
			employee={ employee }
			requirementFulfillments={ requirement_fulfillments }
		/>
	)
}

export default Overview
