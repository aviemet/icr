import { Group, Title, Menu, Page, Section } from "@/Components"
import { Routes } from "@/lib"

interface ShowTimesheetProps {
	timesheet: Schema.TimesheetsShow
}

const ShowTimesheet = ({ timesheet }: ShowTimesheetProps) => {
	const title =  "Timesheet"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Timesheet", href: Routes.timesheets() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editTimesheet(timesheet.id) }>
								Edit Timesheet
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowTimesheet
