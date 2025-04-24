import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Paper, Stack } from "@/Components"
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
			<Paper shadow="sm" p="xl" radius="md" withBorder>
				<Stack>
					<Inputs employee={ employee } jobTitles={ jobTitles } />
				</Stack>
			</Paper>
		</Form>
	)
}

export default EmployeeForm
