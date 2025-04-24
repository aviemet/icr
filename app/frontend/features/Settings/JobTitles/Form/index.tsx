import { type HTTPVerb, type UseFormProps } from "use-inertia-form"

import { Grid } from "@/components"
import { Form, TextInput, Submit, RichText } from "@/components/Form"

import { emptyPermissions, JobTitleFormData } from "./formData"
import PermissionsSection from "./PermissionsSection"


export interface JobTitleFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<JobTitleFormData>) => boolean | void
	job_title: Schema.JobTitlesFormData
}

const JobTitleForm = ({ method = "post", job_title, ...props }: JobTitleFormProps) => {
	return (
		<Form
			model="job_title"
			data={ { job_title, ...emptyPermissions } }
			method={ method }
			{ ...props }
		>
			<Grid>

				<Grid.Col>
					<TextInput name="name" label="Title" />
				</Grid.Col>

				<Grid.Col>
					<RichText name="description" label="Description" />
				</Grid.Col>

				<PermissionsSection />

				<Grid.Col>
					<Submit>{ job_title.id ? "Update" : "Create" } JobTitle</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}

export default JobTitleForm
