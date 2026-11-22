import { EmployeeRequirements } from "@/domains/Employees/Requirements"
import { type RequirementFulfillmentsPayload } from "@/domains/Employees/Requirements/types"

interface RequirementsProps {
	fulfillments: RequirementFulfillmentsPayload
}

const Requirements = ({ fulfillments }: RequirementsProps) => {
	return <EmployeeRequirements fulfillments={ fulfillments } />
}

export default Requirements
