import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import JobTitlesTable from '../Table'

interface IJobTitleIndexProps {
	job_titles: Schema.JobTitlesIndex[]
	pagination: Schema.Pagination
}

const JobTitlesIndex = ({ job_titles, pagination }: IJobTitleIndexProps) => {
	return (
		<IndexPageTemplate
			title="JobTitles"
			model="job_titles"
			rows={ job_titles }
			pagination={ pagination }
			deleteRoute={ Routes.jobTitles() }
			menuOptions={ [
				{ label: 'New Job Title', href: Routes.newJobTitle(), icon: NewIcon },
			] }
		>
			<JobTitlesTable />
		</IndexPageTemplate>
	)
}

export default JobTitlesIndex
