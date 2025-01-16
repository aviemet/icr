import { Heading, Page, Section } from "@/Components"
import { Routes } from "@/lib"
import JobTitlesForm from "../Form"

interface IEditJobTitleProps {
	job_title: Schema.JobTitlesEdit
}

const EditJobTitle = ({ job_title }: IEditJobTitleProps) => {
	const title = "Edit Job Title"

	return (
		<Page title={ title }>
			<Section>
				<Heading>{ title }</Heading>

				<JobTitlesForm
					method='put'
					to={ Routes.jobTitle() }
					job_title={ job_title }
				/>
			</Section>
		</Page>
	)
}

export default EditJobTitle
