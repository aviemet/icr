import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import TimesheetHoursForm from "../Form"

interface EditTimesheetHourProps {
	timesheet_hour: Schema.TimesheetHoursEdit
}

const EditTimesheetHour = ({ timesheet_hour }: EditTimesheetHourProps) => {
	const title = "Edit Timesheet Hour"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Timesheet Hours", href: Routes.timesheetHours() },
			{ title: "TimesheetHour", href: Routes.timesheetHour(timesheet_hour.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>
				
				<TimesheetHoursForm
					method='put'
					to={ Routes.timesheetHour() }
					timesheet_hour={ timesheet_hour }
				/>
			</Section>
		</Page>
	)
}

export default EditTimesheetHour
