import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/Components"
import { Form, TextInput, Submit } from "@/Components/Form"

type PermissionFormData = {
	permission: Schema.PermissionsFormData
}

export interface PermissionFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<PermissionFormData>) => boolean|void
	permission: Schema.PermissionsFormData
}

const PermissionForm = ({ method = "post", permission, ...props }: PermissionFormProps) => {
	return (
		<Form
			model="permission"
			data={ { permission } }
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

export default PermissionForm
