import { Title, Page, Section } from "@/components"
import { JobTitleForm, type JobTitleFormProps } from "@/domains/Settings/JobTitles/Form"
import { Routes, withLayout } from "@/lib"

interface EditJobTitleProps {
	job_title: Schema.EmployeeJobTitlesEdit
	permissions: NonNullable<JobTitleFormProps["permissions"]>
}

const EditJobTitle = ({ job_title, permissions }: EditJobTitleProps) => {
	const title = `Edit ${String(job_title.name || "Job Title")}`

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Job Titles", href: Routes.settingsJobTitles() },
			{ title: "Job Title", href: Routes.settingsJobTitle(String(job_title.slug)) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<JobTitleForm
					method="put"
					to={ Routes.settingsJobTitle(String(job_title.slug)) }
					job_title={ job_title }
					permissions={ permissions }
				/>
			</Section>
		</Page>
	)
}

export default withLayout(EditJobTitle, "settings")
