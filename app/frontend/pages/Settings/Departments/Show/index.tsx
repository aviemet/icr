import { Group, Title, Menu, Page, Section, Text } from "@/components"
import { Routes, withLayout } from "@/lib"

interface ShowDepartmentProps {
	department: Schema.EmployeeDepartmentsShow
	job_titles: Schema.EmployeeJobTitlesIndex[]
}

const ShowDepartment = ({ department, job_titles }: ShowDepartmentProps) => {
	const title = String(department.name || "Department")

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Departments", href: Routes.settingsDepartments() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>
					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editSettingsDepartment(String(department.slug)) }>
								Edit Department
							</Menu.Link>
							<Menu.Link
								href={ Routes.settingsDepartment(String(department.slug)) }
								method="delete"
								as="button"
							>
								Delete Department
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

				{ department.description && (
					<Text mt="md" c="dimmed">{ String(department.description) }</Text>
				) }

				<Title order={ 4 } mt="xl">Job Titles</Title>
				{ job_titles.length === 0
					? <Text size="sm" c="dimmed">No job titles in this department.</Text>
					: job_titles.map(jobTitle => (
						<Text key={ String(jobTitle.id) }>
							{ String(jobTitle.name) }
						</Text>
					)) }
			</Section>
		</Page>
	)
}

export default withLayout(ShowDepartment, "settings")
