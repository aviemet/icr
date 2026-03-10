import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import { EmployeeInterviewTable } from "@/features/Interviews/Table"
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
			deleteRoute={ Routes.interviews() }
			menuOptions={ [
				{ label: "New Interview", href: Routes.newInterview(), icon: <NewIcon /> },
			] }
		>
			<EmployeeInterviewTable />
		</IndexPageTemplate>
	)
}

export default EmployeeInterviewsIndex
