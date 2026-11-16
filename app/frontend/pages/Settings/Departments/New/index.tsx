import { Title, Page, Section } from "@/components"
import { DepartmentForm } from "@/domains/Settings/Departments/Form"
import { Routes, withLayout } from "@/lib"

interface NewDepartmentProps {
	department: Schema.EmployeeDepartmentsFormData
}

const NewDepartment = ({ ...data }: NewDepartmentProps) => {
	const title = "New Department"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Departments", href: Routes.settingsDepartments() },
			{ title: "New Department", href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>
				<DepartmentForm to={ Routes.settingsDepartments() } { ...data } />
			</Section>
		</Page>
	)
}

export default withLayout(NewDepartment, "settings")
