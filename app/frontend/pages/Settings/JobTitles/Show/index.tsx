import { Group, Title, Menu, Page, Section, Table } from "@/components"
import { EmployeeTable } from "@/domains/Employees/Table"
import { Routes, withLayout } from "@/lib"

interface ShowJobTitleProps {
	job_title: Schema.EmployeeJobTitlesShow
	employees: Schema.EmployeesIndex[]
}

const ShowJobTitle = ({ job_title, employees }: ShowJobTitleProps) => {
	const title = String(job_title.name || "Job Title")

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
							<Menu.Link href={ Routes.editSettingsJobTitle(String(job_title.slug)) }>
								Edit Job Title
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

				<Table.Section>
					<Table.TableProvider
						selectable
						model="employees"
						records={ employees }
					>
						<EmployeeTable records={ employees } model="employees" />

						<Table.Pagination />
					</Table.TableProvider>
				</Table.Section>
			</Section>
		</Page>
	)
}

export default withLayout(ShowJobTitle, "settings")
