import { Group, Title, Menu, Page, Section, Table } from "@/Components"
import EmployeesTable from "@/Features/Employees/Table"
import { Routes, withLayout } from "@/lib"

interface ShowJobTitleProps {
	job_title: Schema.JobTitlesShow
	employees: Schema.EmployeesIndex[]
}

const ShowJobTitle = ({ job_title, employees }: ShowJobTitleProps) => {
	const title = job_title.name || "Job Title"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Job Title", href: Routes.settingsJobTitles() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editSettingsJobTitle(job_title.slug) }>
								Edit Job Title
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>


				<Table.Section>
					<Table.TableProvider
						selectable
						model="employees"
						rows={ employees }
					>
						<EmployeesTable />

						<Table.Pagination />
					</Table.TableProvider>
				</Table.Section>
			</Section>
		</Page>
	)
}

export default withLayout(ShowJobTitle, "settings")
