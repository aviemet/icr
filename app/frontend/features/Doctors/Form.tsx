import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

type TDoctorFormData = {
	doctor: Schema.DoctorsFormData
}

export interface DoctorFormProps {
	to: string
	method?: HTTPVerb
	doctor: Schema.DoctorsFormData
}

export function DoctorForm({ method = "post", to, doctor, ...props }: DoctorFormProps) {
	return (
		<Form<TDoctorFormData>
			action={ to }
			initialData={ { doctor } }
			method={ method }
			{ ...props }
		>
			<Grid>
				<Grid.Col>
					<TextInput name="doctor.first_name" label="First_name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="doctor.last_name" label="Last_name" />
				</Grid.Col>
				<Grid.Col>
					<TextInput name="doctor.notes" label="Notes" />
				</Grid.Col>

				<Grid.Col>
					<Submit>{ doctor.id ? "Update" : "Create" } Doctor</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
