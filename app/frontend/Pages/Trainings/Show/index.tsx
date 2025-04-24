import { Group, Title, Menu, Page, Section } from "@/Components"
import { Routes } from "@/lib"

interface ShowTrainingProps {
	training: Schema.TrainingsShow
}

const ShowTraining = ({ training }: ShowTrainingProps) => {
	const title = "Training"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Training", href: Routes.trainings() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editTraining(training.id) }>
								Edit Training
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowTraining
