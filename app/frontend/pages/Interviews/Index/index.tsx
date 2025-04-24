import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import EmployeeInterviewsTable from "@/features/Interviews/Table"
import { Routes } from "@/lib"


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
