import { Badge, Group, Stack, Text, Title, Page, Section, Table } from "@/components"
import { EditButton } from "@/components/Button"
import { EmployeeTable } from "@/domains/Employees/Table"
import { tableRows, type JobTitleFormData, type Permissions } from "@/domains/Settings/JobTitles/Form/formData"
import { Routes, withLayout } from "@/lib"

interface ShowJobTitleProps {
	job_title: Schema.EmployeeJobTitlesShow
	permissions: JobTitleFormData["permissions"]
	employees: Schema.EmployeesIndex[]
}

const actionLabels: Record<keyof Permissions, string> = {
	index: "List",
	show: "View",
	create: "Create",
	update: "Edit",
	delete: "Delete",
	complete: "Complete",
}

function grantedActions(resourcePermissions: Permissions) {
	return (Object.keys(actionLabels) as (keyof Permissions)[]).filter(
		(action) => resourcePermissions[action]
	)
}

const ShowJobTitle = ({ job_title, permissions, employees }: ShowJobTitleProps) => {
	const title = String(job_title.name || "Job Title")
	const description = typeof job_title.description === "string" ? job_title.description : null

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Job Title", href: Routes.settingsJobTitles() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>
					<EditButton href={ Routes.editSettingsJobTitle(String(job_title.slug)) } label={ title } />
				</Group>

				{ description && (
					<Text mt="sm">{ description }</Text>
				) }

				<Stack gap="sm" mt="lg">
					<Title order={ 4 }>Permissions</Title>
					{ permissions.admin
						? (
							<Text size="sm">All listed actions granted.</Text>
						)
						: (
							tableRows.map((row) => {
								const actions = grantedActions(permissions[row.model])
								if(actions.length === 0) return null

								return (
									<Group key={ row.model } gap="xs" align="center">
										<Text size="sm" fw={ 600 } w={ 140 }>{ row.label }</Text>
										{ actions.map((action) => (
											<Badge key={ `${row.model}-${action}` } variant="light">
												{ actionLabels[action] }
											</Badge>
										)) }
									</Group>
								)
							})
						) }
				</Stack>

				<Table.Section>
					<Table.Provider
						selectable
						model="employees"
					>
						<EmployeeTable records={ employees } model="employees" />

						<Table.Pagination />
					</Table.Provider>
				</Table.Section>
			</Section>
		</Page>
	)
}

export default withLayout(ShowJobTitle, "settings")
