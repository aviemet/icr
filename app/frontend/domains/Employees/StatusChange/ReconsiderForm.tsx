import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Routes } from "@/lib"

export interface ReconsiderFormProps {
	employee: Schema.EmployeesShow
}

export function ReconsiderForm({ employee }: ReconsiderFormProps) {
	return (
		<Form
			action={ Routes.statusEmployee(employee.slug) }
			initialData={ {
				employee: {
					event: "reconsider",
					eligible_for_hire: true,
				},
			} }
			method="put"
		>
			<Grid>
				<Grid.Col>
					<Submit>Reconsider Application</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
