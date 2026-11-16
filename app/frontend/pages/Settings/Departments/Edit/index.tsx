import { Title, Page, Section } from "@/components"
import { DepartmentForm } from "@/domains/Settings/Departments/Form"
import { Routes, withLayout } from "@/lib"

interface EditDepartmentProps {
	department: Schema.EmployeeDepartmentsEdit
}

const EditDepartment = ({ department }: EditDepartmentProps) => {
	const title = `Edit ${String(department.name || "Department")}`

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Departments", href: Routes.settingsDepartments() },
			{ title: "Department", href: Routes.settingsDepartment(String(department.slug)) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>
				<DepartmentForm
					method="put"
					to={ Routes.settingsDepartment(String(department.slug)) }
					department={ department }
				/>
			</Section>
		</Page>
	)
}

export default withLayout(EditDepartment, "settings")
