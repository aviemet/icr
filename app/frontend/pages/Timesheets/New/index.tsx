import { Title, Page, Section } from "@/components"
import { TimesheetForm } from "@/domains/TimeSheets/Form"
import { Routes } from "@/lib"


interface NewTimesheetProps {
	timesheet: Schema.TimesheetsFormData
}

const NewTimesheet = ({ ...data }: NewTimesheetProps) => {
	const title = "New Timesheet"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Payroll", href: Routes.payrollPeriods() },
			{ title: "New Timesheet", href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<TimesheetForm
					to={ Routes.timesheets() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewTimesheet
