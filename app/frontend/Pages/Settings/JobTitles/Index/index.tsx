import { Routes, withLayout } from "@/lib"
import { IndexPageTemplate } from "@/Features"
import { NewIcon } from "@/Components/Icons"
import SettingsJobTitlesTable from "../Table"

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
			<SettingsJobTitlesTable />
		</IndexPageTemplate>
	)
}

export default withLayout(JobTitlesIndex, "settings")
