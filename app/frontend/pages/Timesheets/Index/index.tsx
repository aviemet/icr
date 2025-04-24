import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"

import TimesheetsTable from "../Table"

interface TimesheetIndexProps {
	timesheets: Schema.TimesheetsIndex[]
	pagination: Schema.Pagination
}

const TimesheetsIndex = ({ timesheets, pagination }: TimesheetIndexProps) => {
	return (
		<IndexPageTemplate
			title="Timesheets"
			model="timesheets"
			rows={ timesheets }
			pagination={ pagination }
			deleteRoute={ Routes.timesheets() }
			menuOptions={ [
				{ label: "New Timesheet", href: Routes.newTimesheet(), icon: <NewIcon /> },
			] }
		>
			<TimesheetsTable />
		</IndexPageTemplate>
	)
}

export default TimesheetsIndex
