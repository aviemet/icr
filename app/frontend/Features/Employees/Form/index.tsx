import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/Components"
import { Form } from "@/Components/Form"
import { generateRandomColor } from "@/lib/colors"

import Inputs, { EmployeeInputProps } from "./Inputs"

export type EmployeeFormData = {
	employee: Schema.EmployeesFormData
}

export interface EmployeeFormProps extends EmployeeInputProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<EmployeeFormData>) => boolean | void
}

const EmployeeForm = ({ method = "post", employee, jobTitles, ...props }: EmployeeFormProps) => {
	return (
		<Form
			model="employee"
			data={ {
				employee: {
					...employee,
					color: employee?.color || generateRandomColor(),
				} as Schema.EmployeesFormData,
			} }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Inputs employee={ employee } jobTitles={ jobTitles } />
			</Grid>
		</Form>
	)
}

export default EmployeeForm
