import { Group, Title, Page, Section } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface ShowTrainingProps {
	training: Schema.EmployeeTrainingsShow
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
					<EditButton href={ Routes.editTraining(training.id) } label={ title } />
				</Group>
			</Section>
		</Page>
	)
}

export default ShowTraining
