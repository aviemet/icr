import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/components"
import { Form, TextInput, Submit } from "@/components/Form"

type TVendorFormData = {
	vendor: Schema.VendorsFormData
}

export interface VendorFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TVendorFormData>) => boolean | void
	vendor: Schema.VendorsFormData
}

const VendorForm = ({ method = "post", vendor, ...props }: VendorFormProps) => {
	return (
		<Form
			model="vendor"
			data={ { vendor } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="name" label="Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="notes" label="Notes" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ vendor.id ? "Update" : "Create" } Vendor</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default VendorForm
