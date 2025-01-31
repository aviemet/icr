import { Group, Title, Menu, Page, Section } from '@/Components'
import { Routes } from '@/lib'

interface ShowTimesheetHourProps {
	timesheet_hour: Schema.TimesheetHoursShow
}

const ShowTimesheetHour = ({ timesheet_hour }: ShowTimesheetHourProps) => {
	const title =  'TimesheetHour'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Timesheet Hour', href: Routes.timesheetHours() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editTimesheetHour(timesheet_hour.id) }>
								Edit TimesheetHour
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowTimesheetHour
