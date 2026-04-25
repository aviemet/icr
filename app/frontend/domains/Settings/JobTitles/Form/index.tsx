import { Grid } from "@/components"
import { Form, Submit } from "@/components/Form"
import { RichText, TextInput } from "@/components/Inputs"
import { type HTTPVerb } from "@/lib"

import { emptyPermissions } from "./formData"
import { PermissionsSection } from "./PermissionsSection"

export interface JobTitleFormProps {
	to: string
	method?: HTTPVerb
	job_title: Schema.JobTitlesFormData
}

export function JobTitleForm({ method = "post", job_title, to, ...props }: JobTitleFormProps) {
	return (
		<Form
			action={ to }
			method={ method }
			initialData={ { job_title, ...emptyPermissions } }
			{ ...props }
		>
			<Grid>

				<Grid.Col>
					<TextInput name="job_title.name" label="Title" />
				</Grid.Col>

				<Grid.Col>
					<RichText name="job_title.description" label="Description" />
				</Grid.Col>

				<PermissionsSection />

				<Grid.Col>
					<Submit>{ job_title.id ? "Update" : "Create" } JobTitle</Submit>
				</Grid.Col>
			</Grid>
		</Form>
	)
}
