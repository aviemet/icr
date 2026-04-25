import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

type TVendorFormData = {
	vendor: Schema.VendorsFormData
}

export interface VendorFormProps {
	to: string
	method?: HTTPVerb
	vendor: Schema.VendorsFormData
}

export function VendorForm({ method = "post", to, vendor, ...props }: VendorFormProps) {
	return (
		<Form<TVendorFormData>
			action={ to }
			initialData={ { vendor } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="vendor.name" label="Name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="vendor.notes" label="Notes" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ vendor.id ? "Update" : "Create" } Vendor</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
