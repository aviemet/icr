import { Title, Page, Section } from "@/components"
import EmployeeInterviewForm from "@/features/Interviews/Form"
import { Routes } from "@/lib"


interface NewEmployeeInterviewProps {
	employee_interview: Schema.EmployeeInterviewsFormData
}

const NewEmployeeInterview = ({ ...data }: NewEmployeeInterviewProps) => {
	const title = "New Interview"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Interviews", href: Routes.employeeInterviews() },
			{ title: "New Interview", href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<EmployeeInterviewForm
					to={ Routes.employeeInterviews() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewEmployeeInterview
