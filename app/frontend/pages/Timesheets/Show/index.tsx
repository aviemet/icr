import { Group, Title, Page, Section } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface ShowTimesheetProps {
	timesheet: Schema.TimesheetsShow
}

const ShowTimesheet = ({ timesheet }: ShowTimesheetProps) => {
	const title = "Timesheet"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Payroll", href: Routes.payrollPeriods() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>
					<EditButton href={ Routes.editTimesheet(timesheet.id) } label={ title } />
				</Group>
			</Section>
		</Page>
	)
}

export default ShowTimesheet
