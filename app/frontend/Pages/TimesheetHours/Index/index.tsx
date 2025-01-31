import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import TimesheetHoursTable from '../Table'

interface TimesheetHourIndexProps {
	timesheet_hours: Schema.TimesheetHoursIndex[]
	pagination: Schema.Pagination
}

const TimesheetHoursIndex = ({ timesheet_hours, pagination }: TimesheetHourIndexProps) => {
	return (
		<IndexPageTemplate
			title="TimesheetHours"
			model="timesheet_hours"
			rows={ timesheet_hours }
			pagination={ pagination }
			deleteRoute={ Routes.timesheetHours() }
			menuOptions={ [
				{ label: 'New Timesheet Hour', href: Routes.newTimesheetHour(), icon: <NewIcon /> },
			] }
		>
			<TimesheetHoursTable />
		</IndexPageTemplate>
	)
}

export default TimesheetHoursIndex
