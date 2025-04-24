import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"

import EmployeeInterviewsTable from "../Table"

interface EmployeeInterviewIndexProps {
	employee_interviews: Schema.EmployeeInterviewsIndex[]
	pagination: Schema.Pagination
}

const EmployeeInterviewsIndex = ({ employee_interviews, pagination }: EmployeeInterviewIndexProps) => {
	return (
		<IndexPageTemplate
			title="EmployeeInterviews"
			model="employee_interviews"
			rows={ employee_interviews }
			pagination={ pagination }
			deleteRoute={ Routes.employeeInterviews() }
			menuOptions={ [
				{ label: "New Interview", href: Routes.newEmployeeInterview(), icon: <NewIcon /> },
			] }
		>
			<EmployeeInterviewsTable />
		</IndexPageTemplate>
	)
}

export default EmployeeInterviewsIndex
