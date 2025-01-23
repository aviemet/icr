import { Title, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import EmployeeForm from "../Form"

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
