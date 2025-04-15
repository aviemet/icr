import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"

import TimesheetsForm from "../Form"

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
					method='put'
					to={ Routes.timesheet() }
					timesheet={ timesheet }
				/>
			</Section>
		</Page>
	)
}

export default EditTimesheet
