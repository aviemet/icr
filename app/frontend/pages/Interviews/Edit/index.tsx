import { Title, Page, Section } from "@/components"
import { EmployeeInterviewForm } from "@/domains/Interviews/Form"
import { Routes } from "@/lib"


interface EditEmployeeInterviewProps {
	employee_interview: Schema.EmployeeInterviewsEdit
}

const EditEmployeeInterview = ({ employee_interview }: EditEmployeeInterviewProps) => {
	const title = "Edit Interview"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Interviews", href: Routes.interviews() },
			{ title: "EmployeeInterview", href: Routes.interview(employee_interview.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<EmployeeInterviewForm
					method="put"
					to={ Routes.interview(employee_interview.id) }
					employee_interview={ employee_interview }
				/>
			</Section>
		</Page>
	)
}

export default EditEmployeeInterview
