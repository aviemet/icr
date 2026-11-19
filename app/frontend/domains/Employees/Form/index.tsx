import { Form } from "@/components/Form"
import { type HTTPVerb } from "@/lib"
import { generateRandomColor } from "@/lib/colors"

import { Inputs, type EmployeeInputProps } from "./Inputs"

export type { EmployeeInputProps }

export interface EmployeeFormProps extends EmployeeInputProps {
	to: string
	method?: HTTPVerb
}

export function EmployeeForm({ method = "post", employee, jobTitles, to, ...props }: EmployeeFormProps) {
	const initialEmployee: Schema.EmployeesFormData = {
		...employee,
		color: employee?.color || generateRandomColor(),
	}

	return (
		<Form
			action={ to }
			method={ method }
			initialData={ { employee: initialEmployee } }
			{ ...props }
		>
			<Inputs employee={ employee } jobTitles={ jobTitles } />
		</Form>
	)
}
