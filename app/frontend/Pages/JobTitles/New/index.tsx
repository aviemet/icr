import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import JobTitleForm from '../Form'

interface INewJobTitleProps {
	job_title: Schema.JobTitlesFormData
}

const NewJobTitle = ({ ...data }: INewJobTitleProps) => {
	const title = 'New Job Title'

	return (
		<Page title={ title }>

			<Section>
				<Heading>{ title }</Heading>

				<JobTitleForm
					to={ Routes.jobTitles() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewJobTitle
