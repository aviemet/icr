import { Title, Page, Section } from "@/components"
import EmployeeInterviewsForm from "@/features/Interviews/Form"
import { Routes } from "@/lib"


interface EditEmployeeInterviewProps {
	employee_interview: Schema.EmployeeInterviewsEdit
}

const EditEmployeeInterview = ({ employee_interview }: EditEmployeeInterviewProps) => {
	const title = "Edit Interview"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Interviews", href: Routes.employeeInterviews() },
			{ title: "EmployeeInterview", href: Routes.employeeInterview(employee_interview.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<EmployeeInterviewsForm
					method="put"
					to={ Routes.employeeInterview() }
					employee_interview={ employee_interview }
				/>
			</Section>
		</Page>
	)
}

export default EditEmployeeInterview
