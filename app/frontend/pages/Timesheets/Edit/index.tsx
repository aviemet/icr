import { Title, Page, Section } from "@/components"
import TimesheetsForm from "@/features/TimeSheets/Form"
import { Routes } from "@/lib"


interface EditTimesheetProps {
	timesheet: Schema.TimesheetsEdit
}

const EditTimesheet = ({ timesheet }: EditTimesheetProps) => {
	const title = "Edit Timesheet"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Timesheets", href: Routes.timesheets() },
			{ title: "Timesheet", href: Routes.timesheet(timesheet.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<TimesheetsForm
					method="put"
					to={ Routes.timesheets() }
					timesheet={ timesheet }
				/>
			</Section>
		</Page>
	)
}

export default EditTimesheet
