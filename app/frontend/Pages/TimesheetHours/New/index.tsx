import { Title, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import TimesheetHourForm from '../Form'

interface NewTimesheetHourProps {
	timesheet_hour: Schema.TimesheetHoursFormData
}

const NewTimesheetHour = ({ ...data }: NewTimesheetHourProps) => {
	const title = 'New Timesheet Hour'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Timesheet Hours', href: Routes.timesheetHours() },
			{ title: 'New Timesheet Hour', href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<TimesheetHourForm
					to={ Routes.timesheetHours() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewTimesheetHour
