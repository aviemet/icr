import { Title, Page, Section } from "@/Components"
import { Routes, withLayout } from "@/lib"
import JobTitleForm from "@/Features/Settings/JobTitles/Form"

interface NewJobTitleProps {
	job_title: Schema.JobTitlesFormData
}

const NewJobTitle = ({ ...data }: NewJobTitleProps) => {
	const title = "New Job Title"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Job Titles", href: Routes.settingsJobTitles() },
			{ title: "New Job Title", href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<JobTitleForm
					to={ Routes.settingsJobTitles() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default withLayout(NewJobTitle, "settings")
