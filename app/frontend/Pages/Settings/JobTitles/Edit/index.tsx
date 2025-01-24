import { Title, Page, Section } from "@/Components"
import { Routes, withLayout } from "@/lib"
import JobTitlesForm from "@/Features/Settings/JobTitles/Form"

interface EditJobTitleProps {
	job_title: Schema.JobTitlesEdit
}

const EditJobTitle = ({ job_title }: EditJobTitleProps) => {
	const title = `Edit ${job_title.name || "Job Title"}`

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Job Titles", href: Routes.settingsJobTitles() },
			{ title: "Job Title", href: Routes.settingsJobTitle(job_title.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<JobTitlesForm
					method='put'
					to={ Routes.settingsJobTitle(job_title.slug) }
					job_title={ job_title }
				/>
			</Section>
		</Page>
	)
}

export default withLayout(EditJobTitle, "settings")
