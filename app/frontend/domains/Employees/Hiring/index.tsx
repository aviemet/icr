import { Stack } from "@/components"

import { HiringDetails } from "./HiringDetails"
import { InterviewList } from "./InterviewList"
import { OfferList } from "./OfferList"

interface EmployeeHiringProps {
	employee: Schema.EmployeesShow
}

export function EmployeeHiring({ employee }: EmployeeHiringProps) {
	return (
		<Stack gap="lg">
			<HiringDetails employee={ employee } />
			<OfferList employee={ employee } />
			<InterviewList employee={ employee } />
		</Stack>
	)
}
