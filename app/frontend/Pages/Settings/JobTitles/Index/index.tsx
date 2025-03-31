import { NewIcon } from "@/Components/Icons"
import { IndexPageTemplate } from "@/Features"
import JobTitlesTable from "@/Features/Settings/JobTitles/Table"
import { Routes, withLayout } from "@/lib"

interface JobTitleIndexProps {
	job_titles: Schema.JobTitlesIndex[]
	pagination: Schema.Pagination
}

const JobTitlesIndex = ({ job_titles, pagination }: JobTitleIndexProps) => {
	return (
		<IndexPageTemplate
			title="JobTitles"
			model="job_titles"
			rows={ job_titles }
			pagination={ pagination }
			deleteRoute={ Routes.settingsJobTitles() }
			menuOptions={ [
				{ label: "New Job Title", href: Routes.newSettingsJobTitle(), icon: <NewIcon /> },
			] }
		>
			<JobTitlesTable />
		</IndexPageTemplate>
	)
}

export default withLayout(JobTitlesIndex, "settings")
