import { Title, Page, Section } from "@/components"
import { TimesheetForm } from "@/domains/TimeSheets/Form"
import { Routes } from "@/lib"


interface EditTimesheetProps {
	timesheet: Schema.TimesheetsEdit
}

const EditTimesheet = ({ timesheet }: EditTimesheetProps) => {
	const title = "Edit Timesheet"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Payroll", href: Routes.payrollPeriods() },
			{ title: "Timesheet", href: Routes.timesheet(timesheet.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<TimesheetForm
					method="put"
					to={ Routes.timesheets() }
					timesheet={ timesheet }
				/>
			</Section>
		</Page>
	)
}

export default EditTimesheet
