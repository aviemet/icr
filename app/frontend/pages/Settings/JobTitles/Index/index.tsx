import { Box, Button, Link } from "@/components"
import { PlusIcon } from "@/components/Icons"
import { JobTitleTable } from "@/domains/Settings/JobTitles/Table"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface JobTitleIndexProps {
	job_titles: Schema.EmployeeJobTitlesIndex[]
}

const JobTitlesIndex = ({ job_titles }: JobTitleIndexProps) => {
	return (
		<Box>
			<SettingsPageHeader
				title="Job Titles"
				description="Roles used when assigning employees and permissions."
				actions={
					<Button
						component={ Link }
						href={ Routes.newSettingsJobTitle() }
						leftSection={ <PlusIcon size={ 16 } /> }
					>
						New Job Title
					</Button>
				}
			/>
			<JobTitleTable records={ job_titles } />
		</Box>
	)
}

export default withLayout(JobTitlesIndex, "settings")
