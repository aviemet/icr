import { EmployeeTrainings } from "@/domains/Employees/Trainings"

import { type ShowEmployeeProps } from "."

const Trainings = ({
	employee,
	trainingOptions = [],
	can_complete_trainings = false,
}: ShowEmployeeProps) => {
	return (
		<EmployeeTrainings
			employee={ employee }
			trainingOptions={ trainingOptions }
			canCompleteTrainings={ can_complete_trainings }
		/>
	)
}

export default Trainings
