import { Group, Title, Menu, Page, Section } from '@/Components'
import { Routes } from '@/lib'

interface ShowEmployeeInterviewProps {
	employee_interview: Schema.EmployeeInterviewsShow
}

const ShowEmployeeInterview = ({ employee_interview }: ShowEmployeeInterviewProps) => {
	const title =  'EmployeeInterview'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Interview', href: Routes.employeeInterviews() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editEmployeeInterview(employee_interview.id) }>
								Edit EmployeeInterview
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowEmployeeInterview
