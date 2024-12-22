import React from 'react'
import { Group, Heading, Menu, Page, Section } from '@/Components'
import { Routes } from '@/lib'

interface IShowJobTitleProps {
	job_title: Schema.JobTitlesShow
}

const ShowJobTitle = ({ job_title }: IShowJobTitleProps) => {
	const title =  'JobTitle'

	return (
		<Page title={ title }>
			<Section>
				<Group position="apart">
					<Heading>{ title }</Heading>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editJobTitle(job_title.id) }>
								Edit JobTitle
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowJobTitle
