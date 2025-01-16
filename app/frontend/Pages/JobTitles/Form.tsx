import { Form, TextInput, Submit } from "@/Components/Form"
import { type UseFormProps } from "use-inertia-form"

type TJobTitleFormData = {
	job_title: Schema.JobTitlesFormData
}

export interface IJobTitleFormProps {
	to: string
	method?: HTTPVerb
	onSubmit?: (object: UseFormProps<TJobTitleFormData>) => boolean | void
	job_title: Schema.JobTitlesFormData
}

const JobTitleForm = ({ method = "post", job_title, ...props }: IJobTitleFormProps) => {
	return (
		<Form
			model="job_title"
			data={ { job_title } }
			method={ method }
			{ ...props }
		>
			<TextInput name="title" label="Title" />
			<TextInput name="description" label="Description" />
			<Submit>{ job_title.id ? "Update" : "Create" } JobTitle</Submit>
		</Form>
	)
}

export default JobTitleForm
