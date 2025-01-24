import { Group, Title, Menu, Page, Section } from "@/Components"
import { Routes, withLayout } from "@/lib"

interface ShowJobTitleProps {
	job_title: Schema.JobTitlesShow
}

const ShowJobTitle = ({ job_title }: ShowJobTitleProps) => {
	const title = job_title.name || "Job Title"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Job Title", href: Routes.settingsJobTitles() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editSettingsJobTitle(job_title.slug) }>
								Edit Job Title
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>



			</Section>
		</Page>
	)
}

export default withLayout(ShowJobTitle, "settings")
