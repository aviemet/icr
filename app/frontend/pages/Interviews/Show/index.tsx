import { Group, Title, Page, Section } from "@/components"
import { EditButton } from "@/components/Button"
import { InterviewNotes } from "@/domains/Interviews/Notes"
import { Routes } from "@/lib"

interface ShowEmployeeInterviewProps {
	employee_interview: Schema.EmployeeInterviewsShow
}

const ShowEmployeeInterview = ({ employee_interview }: ShowEmployeeInterviewProps) => {
	const title = "Interview"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Interview", href: Routes.interviews() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>
					<EditButton href={ Routes.editInterview(employee_interview.id) } label={ title } />
				</Group>
			</Section>

			<InterviewNotes
				interviewId={ employee_interview.id }
				notes={ employee_interview.interview_notes }
			/>
		</Page>
	)
}

export default ShowEmployeeInterview
