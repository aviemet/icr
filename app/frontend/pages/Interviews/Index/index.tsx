import { NewIcon } from "@/components/Icons"
import { EmployeeInterviewTable, type EmployeeInterviewTableRecord } from "@/domains/Interviews/Table"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"


interface EmployeeInterviewIndexProps {
	employee_interviews: EmployeeInterviewTableRecord[]
	pagination: Schema.Pagination
}

const EmployeeInterviewsIndex = ({ employee_interviews, pagination }: EmployeeInterviewIndexProps) => {
	return (
		<IndexPageTemplate
			title="EmployeeInterviews"
			model="employee_interviews"
			pagination={ pagination }
			deleteRoute={ Routes.interviews() }
			actions={ [
				{ label: "New Interview", href: Routes.newInterview(), icon: <NewIcon /> },
			] }
		>
			<EmployeeInterviewTable records={ employee_interviews } model="employee_interviews" />
		</IndexPageTemplate>
	)
}

export default EmployeeInterviewsIndex
