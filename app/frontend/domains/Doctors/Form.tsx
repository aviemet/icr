import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { TextInput, Textarea } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

type DoctorFormRecord = Schema.DoctorsFormData | Schema.DoctorsEdit

type TDoctorFormData = {
	doctor: DoctorFormRecord
}

export interface DoctorFormProps {
	to: string
	method?: HTTPVerb
	doctor: DoctorFormRecord
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
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<TextInput name="doctor.person.first_name" label="First Name" required />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<TextInput name="doctor.person.last_name" label="Last Name" required />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<TextInput name="doctor.person.middle_name" label="Middle Name" />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<TextInput name="doctor.specialty" label="Specialty" />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<TextInput name="doctor.npi" label="NPI" />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<TextInput name="doctor.practice_name" label="Practice" />
				</Grid.Col>
				<Grid.Col span={ { base: 12, sm: 6 } }>
					<TextInput name="doctor.person.contact.phones[0].number" label="Phone" />
				</Grid.Col>
				<Grid.Col>
					<Textarea name="doctor.notes" label="Notes" minRows={ 3 } />
				</Grid.Col>
				<Grid.Col>
					<Submit>{ doctor.id ? "Update" : "Create" } Doctor</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
