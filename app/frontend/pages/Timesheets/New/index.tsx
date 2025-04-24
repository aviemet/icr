import { Title, Page, Section } from "@/components"
import { Routes } from "@/lib"

import TimesheetForm from "../Form"

interface NewTimesheetProps {
	timesheet: Schema.TimesheetsFormData
}

const NewTimesheet = ({ ...data }: NewTimesheetProps) => {
	const title = "New Timesheet"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Timesheets", href: Routes.timesheets() },
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
