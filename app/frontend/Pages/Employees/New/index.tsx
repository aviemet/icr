import { Title, Page, Section } from "@/Components"
import EmployeeForm from "@/Features/Employees/Form"
import { Routes } from "@/lib"

interface INewEmployeeProps {
	employee: Schema.EmployeesFormData
}

const NewEmployee = ({ ...data }: INewEmployeeProps) => {
	const title = "New Employee"

	return (
		<Page title={ title }>

			<Section>
				<Title>{ title }</Title>

				<EmployeeForm
					to={ Routes.employees() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewEmployee
