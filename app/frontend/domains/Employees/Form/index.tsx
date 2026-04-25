import { Paper, Stack } from "@/components"
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
	const initialData = {
		employee: {
			...employee,
			color: employee?.color || generateRandomColor(),
		} as Schema.EmployeesFormData,
	}

	return (
		<Form action={ to } method={ method } initialData={ initialData } { ...props }>
			<Paper shadow="sm" p="xl" radius="md" withBorder>
				<Stack>
					<Inputs employee={ employee } jobTitles={ jobTitles } />
				</Stack>
			</Paper>
		</Form>
	)
}
