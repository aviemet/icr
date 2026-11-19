import { EmployeeTrainings } from "@/domains/Employees/Trainings"

import { type ShowEmployeeProps } from "."

const Trainings = ({ employee, trainingOptions = [] }: ShowEmployeeProps) => {
	return <EmployeeTrainings employee={ employee } trainingOptions={ trainingOptions } />
}

export default Trainings
