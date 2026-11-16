import { NewIcon } from "@/components/Icons"
import { JobTitleTable } from "@/domains/Settings/JobTitles/Table"
import { IndexPageTemplate } from "@/features"
import { Routes, withLayout } from "@/lib"

interface JobTitleIndexProps {
	job_titles: Schema.EmployeeJobTitlesIndex[]
	pagination: Schema.Pagination
}

const JobTitlesIndex = ({ job_titles, pagination }: JobTitleIndexProps) => {
	return (
		<IndexPageTemplate
			title="JobTitles"
			model="job_titles"
			pagination={ pagination }
			deleteRoute={ Routes.settingsJobTitles() }
			menuOptions={ [
				{ label: "New Job Title", href: Routes.newSettingsJobTitle(), icon: <NewIcon /> },
			] }
		>
			<JobTitleTable records={ job_titles } pagination={ pagination } model="job_titles" />
		</IndexPageTemplate>
	)
}

export default withLayout(JobTitlesIndex, "settings")
