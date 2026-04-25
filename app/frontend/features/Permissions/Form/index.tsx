import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { type HTTPVerb } from "@/lib"

type PermissionFormData = {
	permission: Schema.PermissionsFormData
}

export interface PermissionFormProps {
	to: string
	method?: HTTPVerb
	permission: Schema.PermissionsFormData
}

export function PermissionForm({ method = "post", to, permission, ...props }: PermissionFormProps) {
	return (
		<Form<PermissionFormData>
			action={ to }
			initialData={ { permission } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<Submit>{ permission.id ? "Update" : "Create" } Permission</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
