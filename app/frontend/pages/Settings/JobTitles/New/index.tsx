import { Title, Page, Section } from "@/components"
import JobTitleForm from "@/features/Settings/JobTitles/Form"
import { Routes, withLayout } from "@/lib"

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
